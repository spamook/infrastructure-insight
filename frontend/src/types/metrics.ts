export interface SystemMetrics {
    hostname: string;
    os:  { type: string; platform: string; release: string };
    cpu: { model: string; cores: number; loadAvg: number[] };
    ram: { total: number; free: number; used: number };
    uptime: number;
    timestamp: string;
}