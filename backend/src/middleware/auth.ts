import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { ApiResponse, UserRole } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        role: UserRole;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Authentication required',
    };
    res.status(401).json(response);
    return;
  }

  const payload = AuthService.verifyToken(token);
  
  if (!payload) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid or expired token',
    };
    res.status(401).json(response);
    return;
  }

  req.user = payload;
  next();
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Authentication required',
      };
      res.status(401).json(response);
      return;
    }

    if (!roles.includes(req.user.role)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Insufficient permissions',
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
}
