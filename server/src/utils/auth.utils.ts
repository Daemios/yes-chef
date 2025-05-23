/**
 * Auth Utilities
 * Simple helper functions for authentication
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';

/**
 * Hash a password - converts plain text to encrypted hash
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, authConfig.saltRounds);
};

/**
 * Compare password - checks if plain text matches the hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token - creates a token for the user
 */
export const generateToken = (userId: number, email: string): string => {
  const payload = { userId, email };
  
  return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '7d' });
};

/**
 * Verify JWT token - checks if a token is valid
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, authConfig.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
