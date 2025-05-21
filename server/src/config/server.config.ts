/**
 * Server configuration
 * Centralizes server configuration settings
 */

// Environment variables with defaults
export const config = {
  // Server configuration
  port: process.env.PORT || 3002, // Using port 3002 to avoid conflicts
  env: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Other settings
  apiPrefix: '/api',
  
  // Flags
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  isTest: process.env.NODE_ENV === 'test'
};
