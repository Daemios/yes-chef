/**
 * Express application setup
 * Configures and exports the Express application instance
 */
import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/server.config';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

// Create Express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.corsOrigin }));

// Logging middleware - only use in development
if (config.isDevelopment) {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/', routes);

// Serve static files from the Vue app in production
if (config.isProduction) {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
    // Handle any requests that don't match defined routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware - must be after routes
app.use(errorMiddleware);

export default app;
