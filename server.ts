import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { exec } from "child_process";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/execute", async (req, res) => {
    const { script } = req.body;
    
    if (!script) {
      return res.status(400).json({ error: "No script provided" });
    }

    const isQScript = script.split('\n').some((line: string) => {
      const trimmed = line.trim();
      return !trimmed.startsWith('#') && trimmed.includes('|');
    });

    if (isQScript) {
      // Simulate Q Protocol script execution
      const lines = script.trim().split('\n');
      const logs: string[] = [];
      let imageGenerated = false;

      for (const line of lines) {
        if (line.trim().startsWith('#') || !line.trim()) continue;

        const parts = line.split('|');
        if (parts.length !== 3) {
          logs.push(`ERROR: Invalid Q Protocol syntax: "${line}"`);
          continue;
        }

        const [domain, sequence, outcome] = parts;
        
        logs.push(`Executing Q Protocol: ${line}`);
        logs.push(`  -> Domain: ${domain}`);
        logs.push(`  -> Sequence: ${sequence.replace(/→/g, ' -> ')}`);
        
        if (/CAPTURE|IMAGE|ACQUIRE/i.test(domain)) {
            logs.push('  -> Camera shutter opening...');
            logs.push('  -> Acquiring image data...');
            logs.push('  -> Capture successful.');
            if (!imageGenerated) {
                logs.push('[IMAGE_GENERATED]');
                imageGenerated = true;
            }
        } else if (/EXPERIMENT|LOOP|RECOVER/i.test(domain)) {
            logs.push('  -> Starting complex experiment sequence...');
            logs.push('  -> Monitoring progress...');
        }

        logs.push(`SUCCESS: ${outcome}`);
      }

      if (logs.length === 0) {
          logs.push("Script is empty or contains only comments.");
      }

      // Simulate network delay
      setTimeout(() => {
        res.json({ stdout: logs.join('\n'), stderr: '' });
      }, 500);
    } else {
      // Write the script to a temporary file
      const tempScriptPath = path.join(process.cwd(), "temp_script.py");
      
      fs.writeFileSync(tempScriptPath, script);

      exec(`python3 ${tempScriptPath}`, (error, stdout, stderr) => {
        // Clean up temp file
        if (fs.existsSync(tempScriptPath)) {
          fs.unlinkSync(tempScriptPath);
        }

        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ error: error.message, stderr, stdout });
        }
        
        res.json({ stdout, stderr });
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
