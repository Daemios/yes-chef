/**
 * Authentication Configuration
 * Simple config for JWT and auth settings
 */

export const authConfig = {
  // JWT Secret - in production, use environment variable
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  
  // JWT expiration times
  jwtExpiresIn: '7d', // Token expires in 7 days
  
  // Password settings
  saltRounds: 10 // How many times to hash the password
};
