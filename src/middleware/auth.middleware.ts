import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../utils/apiErrors';
import { verifyToken } from '../utils/jwt.utils';
import UserModel from '../models/user.model';
import mongoose from 'mongoose';

// We'll rely on the existing Express type declarations for Request.user
// This avoids conflicts with other type declarations in the codebase

// For TypeScript: extend the Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies
    const token = req.cookies.access_token;
    
    if (!token) {
      throw new UnauthorizedException('Authentication required. Please log in.');
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await UserModel.findById(decoded.userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    
    // Attach user to request
    req.user = user.toObject();
    req.userId = String(user._id);
    
    next();
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implement refresh token logic here
    next();
  } catch (error) {
    next(error);
  }
};
