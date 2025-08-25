import type { GalleryImage } from '../types';

const DB_NAME = 'CubeGalleryDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

const initDB = (): Promise<IDBDatabase> => {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not supported by this browser.'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
          console.error('Error opening IndexedDB', request.error);
          dbPromise = null; // Reset promise on error to allow retries
          reject(new Error(`IndexedDB error: ${request.error?.message}`));
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
          dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }
  
  return dbPromise;
};

const parseCubeScriptForTags = (script: string): { system: string, technique: string } => {
    const upperScript = script.toUpperCase();
    
    // Systems
    const systems = ['AXL', 'MARIANAS', 'SLIDEBOOK'];
    const foundSystem = systems.find(s => upperScript.includes(s)) || 'Generic';
    
    // Techniques
    const techniques: { [key: string]: string } = {
        'LATTICE': 'Lattice', 'CLEARED': 'Cleared Tissue', 'LIVE_CELL': 'Live Cell', 
        'DECONVOLVE': 'Deconvolution', 'AI_SEGMENT': 'AI Segmentation', 'REALTIME_DECONV': 'Deconvolution',
        'CONFOCAL': 'Confocal', 'SORA': 'Super-Resolution', 'FRAP': 'FRAP',
        'MULTIVIEW_FUSION': 'Multiview Fusion', 'MASSIVE_VOLUME': 'Volume Imaging', 'LIVE_PROCESS': 'Live Processing',
        'SUPER_RES': 'Super-Resolution', 'SRDTRANS': 'Super-Resolution', 'SIMULATE': 'ML Simulation',
    };
    const foundTechniqueKey = Object.keys(techniques).find(t => upperScript.includes(t)) || 'Standard';

    return {
        system: foundSystem,
        technique: techniques[foundTechniqueKey] || foundTechniqueKey
    };
};

export const saveImage = async (imageUrl: string, cubeScript: string): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const image: GalleryImage = {
        id: Date.now(),
        imageUrl,
        cubeScript,
        createdAt: new Date(),
        tags: parseCubeScriptForTags(cubeScript)
    };

    return new Promise((resolve, reject) => {
        const request = store.add(image);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Error saving image: ${request.error?.message}`));
    });
};

export const getImages = async (): Promise<GalleryImage[]> => {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
            const sorted = request.result.sort((a, b) => b.id - a.id);
            resolve(sorted);
        };
        request.onerror = () => reject(new Error(`Error fetching images: ${request.error?.message}`));
    });
};

export const deleteImage = async (id: number): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Error deleting image: ${request.error?.message}`));
    });
};