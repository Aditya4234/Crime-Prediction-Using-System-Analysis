import { Router, Request, Response } from 'express';
import { UnitService } from '../services';
import { asyncHandler } from '../middleware';
import { ApiResponse } from '../types';

const router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const data = await UnitService.getAll();
  const response: ApiResponse<typeof data> = {
    success: true,
    data,
    message: `Found ${data.total} units`,
  };
  res.json(response);
}));

router.get('/active', asyncHandler(async (_req: Request, res: Response) => {
  const units = await UnitService.getActive();
  const response: ApiResponse<typeof units> = {
    success: true,
    data: units,
  };
  res.json(response);
}));

router.get('/zone/:zone', asyncHandler(async (req: Request, res: Response) => {
  const units = await UnitService.getByZone(req.params.zone);
  const response: ApiResponse<typeof units> = {
    success: true,
    data: units,
  };
  res.json(response);
}));

router.get('/messages', asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const messages = await UnitService.getMessages(limit);
  const response: ApiResponse<typeof messages> = {
    success: true,
    data: messages,
  };
  res.json(response);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const unit = await UnitService.getById(req.params.id);
  
  if (!unit) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Unit not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<typeof unit> = {
    success: true,
    data: unit,
  };
  res.json(response);
}));

router.patch('/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['patrol', 'responding', 'standby', 'staging', 'offline'].includes(status)) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid status',
    };
    res.status(400).json(response);
    return;
  }

  const unit = await UnitService.updateStatus(req.params.id, status);
  
  if (!unit) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Unit not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<typeof unit> = {
    success: true,
    data: unit,
    message: 'Unit status updated successfully',
  };
  res.json(response);
}));

router.post('/messages', asyncHandler(async (req: Request, res: Response) => {
  const { from, msg, priority } = req.body;
  
  if (!from || !msg) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Missing required fields: from, msg',
    };
    res.status(400).json(response);
    return;
  }

  const message = await UnitService.sendMessage(from, msg, priority);
  const response: ApiResponse<typeof message> = {
    success: true,
    data: message,
    message: 'Message sent successfully',
  };
  res.status(201).json(response);
}));

export default router;
