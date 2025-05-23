/**
 * Auth Middleware
 * Protects routes by checking if user has valid token
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';

/**
 * Middleware to protect routes
 * Checks if user has valid JWT token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    // Format: "Bearer your-jwt-token"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Get the token part

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    // Add user info to request object so other routes can use it
    (req as any).user = decoded;
    
    // Continue to the next middleware/route
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
