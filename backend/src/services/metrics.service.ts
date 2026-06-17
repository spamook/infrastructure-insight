import os from 'os';

export interface SystemMetrics {
    hostname: string;
    os: { type: string; platform: string; release: string };
    cpu: { model: string; cores: number; loadAvg: number[] };
    ram: { total: number; free: number; used: number };
    uptime: number;
    timestamp: string;
}

export function collectMetrics(): SystemMetrics {
    const cpus = os.cpus();
    const totalMb = Math.round(os.totalmem() / 1024 / 1024);
    const freeMb  = Math.round(os.freemem()  / 1024 / 1024);

    return {
        hostname: os.hostname(),
        os: {
            type:     os.type(),
            platform: os.platform(),
            release:  os.release(),
        },
        cpu: {
            model:   cpus[0]?.model ?? 'Unknown',
            cores:   cpus.length,
            loadAvg: os.loadavg(),
        },
        ram: { total: totalMb, free: freeMb, used: totalMb - freeMb },
        uptime:    Math.round(os.uptime()),
        timestamp: new Date().toISOString(),
    };
}