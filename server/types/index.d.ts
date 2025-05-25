// Make TypeScript treat files as modules
declare module '*.ts';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        iat: number;
        exp: number;
      };
    }
  }
}
