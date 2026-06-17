import { Request, Response } from 'express';
import { collectMetrics } from '../services/metrics.service';

export function getMetrics(_req: Request, res: Response): void {
    res.json(collectMetrics());
}