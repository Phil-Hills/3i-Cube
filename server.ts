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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
