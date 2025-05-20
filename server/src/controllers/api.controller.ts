/**
 * API Controllers
 * Contains business logic for API routes
 */
import { Request, Response } from 'express';

/**
 * Get hello message
 * @param req Express request
 * @param res Express response
 */
export const getHello = (_req: Request, res: Response): void => {
  res.json({ message: 'Hello from Yes-Chef API!' });
};
