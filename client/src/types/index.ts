/**
 * Types directory
 * Contains TypeScript interfaces, type definitions, and enums
 * This index file exports all types for easy imports
 */

// Common interfaces
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Export all types
export * from './recipe';
export * from './user';

// Add more type exports as needed
