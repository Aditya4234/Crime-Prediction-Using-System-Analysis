import { Router, Request, Response } from 'express';
import { AlertService } from '../services';
import { asyncHandler } from '../middleware';
import { ApiResponse, Alert } from '../types';
import { getCollection, updateCollection } from '../lib/database';

const router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const alerts = await AlertService.getAll();
  const response: ApiResponse<typeof alerts> = {
    success: true,
    data: alerts,
    message: `Found ${alerts.length} alerts`,
  };
  res.json(response);
}));

router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { code, type, location, priority } = req.body;

  if (!type || !location) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Type and location are required',
    };
    res.status(400).json(response);
    return;
  }

  const alerts = await getCollection('alerts') as Alert[];
  const newAlert: Alert = {
    id: `ALT-${String(alerts.length + 1).padStart(3, '0')}`,
    code: code || 'CODE-1',
    type,
    location,
    priority: priority || 'medium',
    status: 'responding',
    units: [],
    time: 'Just now',
    dispatchedAt: new Date().toISOString(),
  };

  alerts.push(newAlert);
  await updateCollection('alerts', alerts);

  const response: ApiResponse<Alert> = {
    success: true,
    data: newAlert,
    message: 'Alert created successfully',
  };
  res.status(201).json(response);
}));

router.get('/active', asyncHandler(async (_req: Request, res: Response) => {
  const alerts = await AlertService.getActive();
  const response: ApiResponse<typeof alerts> = {
    success: true,
    data: alerts,
    message: `Found ${alerts.length} active alerts`,
  };
  res.json(response);
}));

router.get('/priority/:priority', asyncHandler(async (req: Request, res: Response) => {
  const { priority } = req.params;
  if (!['critical', 'high', 'medium', 'low'].includes(priority)) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid priority level',
    };
    res.status(400).json(response);
    return;
  }

  const alerts = await AlertService.getByPriority(priority as any);
  const response: ApiResponse<typeof alerts> = {
    success: true,
    data: alerts,
  };
  res.json(response);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const alert = await AlertService.getById(req.params.id);
  
  if (!alert) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Alert not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<typeof alert> = {
    success: true,
    data: alert,
  };
  res.json(response);
}));

router.patch('/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['responding', 'contained', 'resolved'].includes(status)) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid status. Must be: responding, contained, or resolved',
    };
    res.status(400).json(response);
    return;
  }

  const alert = await AlertService.updateStatus(req.params.id, status);
  
  if (!alert) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Alert not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<typeof alert> = {
    success: true,
    data: alert,
    message: 'Alert status updated successfully',
  };
  res.json(response);
}));

export default router;
