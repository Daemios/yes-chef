/**
 * Server entry point
 */
// Register module aliases before importing other modules
import './config/module-alias';

import app from './app';
import { config } from './config/server.config';
import { createServer } from 'net';
import { Server } from 'http';

// Function to check if a port is available
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', () => {
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
};

// Function to find an available port
const findAvailablePort = async (startPort: number, maxAttempts = 10): Promise<number> => {
  let port = startPort;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
    attempts++;
  }
  
  throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
};

// Main server module - rewritten with proper exports
const startServer = async (): Promise<Server> => {
  try {
    const port = await findAvailablePort(Number(config.port));
    const server = app.listen(port, () => {
      console.log(`Server running in ${config.env} mode on port ${port}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      // Graceful shutdown
      server.close(() => process.exit(1));
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Don't export the server directly, export the function that creates it
export default startServer();

// For testing and other imports, also export the server-starting function
export { startServer };
