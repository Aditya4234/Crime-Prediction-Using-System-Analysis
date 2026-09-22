import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export function logger(req: Request, _res: Response, next: NextFunction): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

export function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const contentType = req.headers['content-type'];
  
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!contentType || !contentType.includes('application/json')) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Content-Type must be application/json',
      };
      res.status(400).json(response);
      return;
    }
  }
  
  next();
}
