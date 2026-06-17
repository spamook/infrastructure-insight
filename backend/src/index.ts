import express from 'express';
import cors from 'cors';
import metricsRouter from './routes/metrics.routes';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());
app.use('/', metricsRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`[backend] port ${PORT}`));