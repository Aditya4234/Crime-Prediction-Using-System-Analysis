import { Router, Request, Response } from 'express';
import { IncidentService } from '../services';
import { ApiResponse } from '../types';
import { asyncHandler } from '../middleware';

const router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const stats = await IncidentService.getStats();
  const response: ApiResponse<typeof stats> = {
    success: true,
    data: stats,
  };
  res.json(response);
}));

export default router;
