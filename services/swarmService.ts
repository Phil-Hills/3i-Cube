export interface AgentStatus {
  name: string;
  status: 'ready' | 'busy' | 'offline';
  tasks_completed: number;
  last_active: string;
}

export interface SwarmStatus {
  analyst: AgentStatus;
  memory: AgentStatus;
  sentinel: AgentStatus;
  registrar: AgentStatus;
}

export interface SystemCheckResult {
  analyst: { passed: boolean; message: string };
  memory: { passed: boolean; message: string };
  sentinel: { passed: boolean; message: string; integrity_score?: number };
}

const BRAIN_URL = import.meta.env.VITE_BRAIN_URL || 'https://service-3i-brain-235894147478.us-west1.run.app';

// Mock state for the frontend since we don't have a real backend for these specific endpoints yet
let mockSwarmState: SwarmStatus = {
  analyst: { name: 'Analyst', status: 'ready', tasks_completed: 142, last_active: new Date().toISOString() },
  memory: { name: 'Memory', status: 'ready', tasks_completed: 89, last_active: new Date().toISOString() },
  sentinel: { name: 'Sentinel', status: 'ready', tasks_completed: 256, last_active: new Date().toISOString() },
  registrar: { name: 'Registrar', status: 'ready', tasks_completed: 34, last_active: new Date().toISOString() }
};

export const analyzeSession = async () => {
  // POST /agent/analyze
  mockSwarmState.analyst.tasks_completed++;
  mockSwarmState.analyst.last_active = new Date().toISOString();
  return { insights: ["Detected optimal Z-stack step size", "Fluorescence bleaching within normal limits"] };
};

export const getMemorySummary = async () => {
  // POST /agent/remember
  mockSwarmState.memory.tasks_completed++;
  mockSwarmState.memory.last_active = new Date().toISOString();
  return { summary: "Session focused on live cell imaging with GFP. 3 datasets acquired." };
};

export const verifyIntegrity = async () => {
  // POST /agent/verify
  mockSwarmState.sentinel.tasks_completed++;
  mockSwarmState.sentinel.last_active = new Date().toISOString();
  return { passed: true, integrity_score: 0.99 };
};

export const registerFiducials = async () => {
  // POST /agent/register
  mockSwarmState.registrar.tasks_completed++;
  mockSwarmState.registrar.last_active = new Date().toISOString();
  return { success: true, error: 0.4 };
};

export const getSwarmStatus = async (): Promise<SwarmStatus> => {
  // In a real app, this would fetch from the backend
  return JSON.parse(JSON.stringify(mockSwarmState));
};

export const runFullSystemCheck = async (): Promise<SystemCheckResult> => {
  const [analystRes, memoryRes, sentinelRes] = await Promise.all([
    analyzeSession(),
    getMemorySummary(),
    verifyIntegrity()
  ]);

  return {
    analyst: { passed: true, message: analystRes.insights.join(', ') },
    memory: { passed: true, message: memoryRes.summary },
    sentinel: { passed: sentinelRes.passed, message: sentinelRes.passed ? 'Integrity verified' : 'Integrity check failed', integrity_score: sentinelRes.integrity_score }
  };
};
