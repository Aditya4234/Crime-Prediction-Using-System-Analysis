import { Router, Request, Response } from 'express';
import { IncidentService } from '../services';
import { asyncHandler } from '../middleware';
import { ApiResponse, CreateIncidentInput } from '../types';

const router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const incidents = await IncidentService.getAll();
  const response: ApiResponse<typeof incidents> = {
    success: true,
    data: incidents,
    message: `Found ${incidents.length} incidents`,
  };
  res.json(response);
}));

router.get('/stats', asyncHandler(async (_req: Request, res: Response) => {
  const stats = await IncidentService.getStats();
  const response: ApiResponse<typeof stats> = {
    success: true,
    data: stats,
  };
  res.json(response);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const incident = await IncidentService.getById(req.params.id);
  
  if (!incident) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Incident not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<typeof incident> = {
    success: true,
    data: incident,
  };
  res.json(response);
}));

router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { type, severity, location, victim, suspect, description } = req.body;

  if (!type || !severity || !location || !victim) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Missing required fields: type, severity, location, victim',
    };
    res.status(400).json(response);
    return;
  }

  const input: CreateIncidentInput = {
    type,
    severity,
    location,
    victim,
    suspect,
    description,
  };

  const incident = await IncidentService.create(input);
  const response: ApiResponse<typeof incident> = {
    success: true,
    data: incident,
    message: 'Incident created successfully',
  };
  res.status(201).json(response);
}));

router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const incident = await IncidentService.update(req.params.id, req.body);
  
  if (!incident) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Incident not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<typeof incident> = {
    success: true,
    data: incident,
    message: 'Incident updated successfully',
  };
  res.json(response);
}));

router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const deleted = await IncidentService.delete(req.params.id);
  
  if (!deleted) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Incident not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<null> = {
    success: true,
    message: 'Incident deleted successfully',
  };
  res.json(response);
}));

export default router;
