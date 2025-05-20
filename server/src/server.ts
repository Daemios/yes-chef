/**
 * Server entry point
 */
import app from './app';
import { config } from './config/server.config';

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running in ${config.env} mode on port ${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Graceful shutdown
  server.close(() => process.exit(1));
});

export default server;
