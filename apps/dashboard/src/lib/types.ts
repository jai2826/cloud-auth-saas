// apps/web/app/lib/types.ts

export interface APIConfig {
  workerUrl: string;
  authToken: string;
  cacheEnabled: boolean;
  cacheTtl: number;
  simulateLatency: boolean;
}

export interface Policy {
  id: string;
  tenant_id?: string;
  role: string;
  resource: string;
  action: string;
  description?: string;
  conditions?: Record<string, string | number | boolean>;
  created_at?: string;
}

export interface SimulationResult {
  allowed: boolean;
  reason: string;
  cacheStatus: string;
  latencyMs: number;
}