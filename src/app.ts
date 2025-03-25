import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import { morganMiddleware } from './utils/logging';
import { setupSwagger } from './config/swagger';
import compression from 'compression';
import applySecurityMiddleware from './utils/security';

import 'reflect-metadata';
import './config/passport';

const app = express();
app.use(express.json());
app.use(compression());

// Setup Swagger
setupSwagger(app);

// Apply security middleware
applySecurityMiddleware(app);

app.use(passport.initialize());

// Logging
app.use(morganMiddleware);

// Routes
import { setupRoutes } from './routes/routes';
setupRoutes(app);

// Global error handler
import { globalErrorHandler } from './utils/errorHandler';
app.use(globalErrorHandler);

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.disconnect();
  process.exit(0);
});

export default app;
