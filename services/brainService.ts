import { blake3 } from '@noble/hashes/blake3.js';
import { bytesToHex } from '@noble/hashes/utils.js';

const BRAIN_URL = import.meta.env.VITE_BRAIN_URL || 'https://service-3i-brain-235894147478.us-west1.run.app';

export function getSessionTraceId() {
  let traceId = sessionStorage.getItem('trace_id');
  if (!traceId) {
    traceId = crypto.randomUUID();
    sessionStorage.setItem('trace_id', traceId);
  }
  return traceId;
}

export async function storeCube(coordinate: string, result: any) {
  const payload = {
    cube_type: 'execution_receipt',
    coordinate,
    result,
    timestamp: new Date().toISOString(),
    hash: bytesToHex(blake3(new TextEncoder().encode(JSON.stringify({coordinate, result})))),
    trace_id: getSessionTraceId(),
    source: '3i-cube-app',
    tags: ['3i', 'microscopy', 'receipt']
  };
  
  return fetch(`${BRAIN_URL}/cube`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }).then(r => r.json());
}

export async function getCubes(limit = 20, coordinate?: string, trace_id?: string) {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (coordinate) params.append('coordinate', coordinate);
  if (trace_id) params.append('trace_id', trace_id);
  
  return fetch(`${BRAIN_URL}/cubes?${params.toString()}`)
    .then(async r => {
      if (!r.ok) {
        return [];
      }
      const data = await r.json();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.cubes)) return data.cubes;
      if (data && Array.isArray(data.data)) return data.data;
      return [];
    })
    .catch(err => {
      console.error('Error fetching cubes:', err);
      return [];
    });
}

export async function checkBrainHealth() {
  try {
    const res = await fetch(`${BRAIN_URL}/health`);
    return res.ok;
  } catch (e) {
    return false;
  }
}
