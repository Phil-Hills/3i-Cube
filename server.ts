import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

// Firebase Admin removed due to permission issues in the AI Studio environment.
// The app will use the in-memory store fallback.
let db: any = null;
const inMemoryCubes: any[] = [];

const FIRESTORE_COLLECTION = process.env.FIRESTORE_COLLECTION || '3i-cubes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: '3i-cube-brain', mode: db ? 'firestore' : 'in-memory' });
  });

  app.post('/api/cube', async (req, res) => {
    try {
      const payload = req.body;
      if (!payload.hash) {
        return res.status(400).json({ error: 'Missing hash' });
      }
      
      if (db) {
        const docRef = db.collection(FIRESTORE_COLLECTION).doc(payload.hash);
        await docRef.set({
          ...payload,
          server_timestamp: new Date().toISOString()
        });
      } else {
        inMemoryCubes.push({
          ...payload,
          server_timestamp: new Date().toISOString()
        });
      }
      
      res.json({ success: true, hash: payload.hash });
    } catch (error) {
      console.error('Error storing cube:', error);
      res.status(500).json({ error: 'Failed to store cube' });
    }
  });

  app.get('/api/cubes', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const coordinate = req.query.coordinate as string;
      const trace_id = req.query.trace_id as string;
      
      if (db) {
        let query: any = db.collection(FIRESTORE_COLLECTION);
        
        if (coordinate) {
          query = query.where('coordinate', '==', coordinate);
        }
        if (trace_id) {
          query = query.where('trace_id', '==', trace_id);
        }
        
        query = query.orderBy('timestamp', 'desc').limit(limit);
        
        const snapshot = await query.get();
        const cubes = snapshot.docs.map(doc => doc.data());
        
        res.json(cubes);
      } else {
        let filtered = inMemoryCubes;
        if (coordinate) {
          filtered = filtered.filter(c => c.coordinate === coordinate);
        }
        if (trace_id) {
          filtered = filtered.filter(c => c.trace_id === trace_id);
        }
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        res.json(filtered.slice(0, limit));
      }
    } catch (error) {
      console.error('Error fetching cubes:', error);
      res.status(500).json({ error: 'Failed to fetch cubes' });
    }
  });

  app.post('/api/search', async (req, res) => {
    try {
      const { query, limit = 10 } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
      }

      // In a real implementation, we would:
      // 1. Generate an embedding for the query using Gemini
      // 2. Perform a vector search in Firestore or a dedicated vector DB
      // For this demo, we'll do a simple text match if we're using in-memory,
      // or just return recent cubes if using Firestore (since vector search requires setup)
      
      if (db) {
        // Fallback to returning recent cubes for now
        const snapshot = await db.collection(FIRESTORE_COLLECTION)
          .orderBy('timestamp', 'desc')
          .limit(limit)
          .get();
        const cubes = snapshot.docs.map(doc => doc.data());
        res.json({ results: cubes, message: 'Semantic search requires vector DB setup. Returning recent cubes.' });
      } else {
        // Simple text search for in-memory fallback
        const results = inMemoryCubes
          .filter(c => 
            c.coordinate.toLowerCase().includes(query.toLowerCase()) || 
            JSON.stringify(c.result).toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, limit);
        res.json({ results, message: 'In-memory text search results' });
      }
    } catch (error) {
      console.error('Error searching cubes:', error);
      res.status(500).json({ error: 'Failed to search cubes' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
