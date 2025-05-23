/**
 * Server entry point
 */
// Register module aliases before importing other modules
import './config/module-alias';

import app from './app';
import { config } from './config/server.config';
import { createServer } from 'net';
import { Server } from 'http';
import fs from 'fs';
import path from 'path';

// Function to update the server port file
const updateServerPortFile = (port: number): void => {
  try {
    const portFilePath = path.join(__dirname, '../../server-port.json');
    const portData = {
      port,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(portFilePath, JSON.stringify(portData, null, 2));
    console.log(`Updated server port file with port ${port}`);
  } catch (error) {
    console.warn('Failed to update server port file:', error);
  }
};

// Function to check if a port is available
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', (err: any) => {
      console.log(`Port ${port} is not available: ${err.message}`);
      resolve(false);
    });
    
    server.once('listening', () => {
      console.log(`Port ${port} is available`);
      server.close();
      resolve(true);
    });
    
    // Bind to localhost only for better compatibility
    server.listen(port, 'localhost');
  });
};

// Function to find an available port
const findAvailablePort = async (startPort: number, maxAttempts = 10): Promise<number> => {
  let port = startPort;
  let attempts = 0;
  
  console.log(`Looking for available port starting from ${startPort}...`);
  
  while (attempts < maxAttempts) {
    console.log(`Checking port ${port}...`);
    if (await isPortAvailable(port)) {
      console.log(`Found available port: ${port}`);
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
    
    // Update the port file with the actual port being used
    updateServerPortFile(port);
    
    const server = app.listen(port, 'localhost', () => {
      console.log(`Server running in ${config.env} mode on http://localhost:${port}`);
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
