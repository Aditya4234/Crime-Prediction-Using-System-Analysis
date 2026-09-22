import { Router, Request, Response } from 'express';
import { AuthService } from '../services';
import { asyncHandler } from '../middleware';
import { ApiResponse } from '../types';

const router = Router();

router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Username and password are required',
    };
    res.status(400).json(response);
    return;
  }

  const result = await AuthService.login({ username, password });
  
  if (!result) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid username or password',
    };
    res.status(401).json(response);
    return;
  }

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  const response: ApiResponse<typeof result> = {
    success: true,
    data: result,
    message: 'Login successful',
  };
  res.json(response);
}));

router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, fullName, badge, role } = req.body;

  if (!username || !email || !password || !fullName || !badge) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'All fields are required',
    };
    res.status(400).json(response);
    return;
  }

  const result = await AuthService.register({ username, email, password, fullName, badge, role });
  
  if (!result) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Username or email already exists',
    };
    res.status(409).json(response);
    return;
  }

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  const response: ApiResponse<typeof result> = {
    success: true,
    data: result,
    message: 'Registration successful',
  };
  res.status(201).json(response);
}));

router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Not authenticated',
    };
    res.status(401).json(response);
    return;
  }

  const user = await AuthService.getUserFromToken(token);
  
  if (!user) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid token',
    };
    res.status(401).json(response);
    return;
  }

  const response: ApiResponse<typeof user> = {
    success: true,
    data: user,
  };
  res.json(response);
}));

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  const response: ApiResponse<null> = {
    success: true,
    message: 'Logged out successfully',
  };
  res.json(response);
});

export default router;
