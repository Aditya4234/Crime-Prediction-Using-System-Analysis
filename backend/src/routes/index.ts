import { Router, Request, Response } from 'express';
import incidentsRouter from './incidents';
import alertsRouter from './alerts';
import unitsRouter from './units';
import statsRouter from './stats';
import authRouter from './auth';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'CPAS Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/auth', authRouter);
router.use('/incidents', incidentsRouter);
router.use('/alerts', alertsRouter);
router.use('/units', unitsRouter);
router.use('/stats', statsRouter);

export default router;
