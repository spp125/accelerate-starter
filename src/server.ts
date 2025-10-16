/**
 * Express SSR Server
 * Lean and clean - all bootstrap logic is in separate modules
 */
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import cookieParser from 'cookie-parser';
import { join } from 'node:path';

// Bootstrap and configuration
import { bootstrap } from './server/bootstrap';
import { config, ENVIRONMENT } from './config';

// Middleware
import { cspMiddleware } from './server/middleware/csp.middleware';
import { errorHandler, notFoundHandler } from './server/middleware/error.middleware';

// Routes
import apiRoutes from './server/routes/api.routes';

const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * Create and configure Express app
 */
async function createApp() {
  // Bootstrap all dependencies (certs, vault, AWS, OpenSearch)
  await bootstrap();

  const app = express();
  const angularApp = new AngularNodeAppEngine();

  // ===== Middleware =====
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cspMiddleware);

  // ===== API Routes =====
  app.use('/api', apiRoutes);

  // ===== Static Files =====
  app.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      redirect: false,
    }),
  );

  // ===== Angular SSR =====
  app.use((req, res, next) => {
    angularApp
      .handle(req)
      .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
      .catch(next);
  });

  // ===== Error Handling =====
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  createApp()
    .then((app) => {
      const port = config.server.port;
      const host = config.server.host;

      app.listen(port, () => {
        console.log(`\n🚀 Server is running!`);
        console.log(`📍 Local: http://${host}:${port}`);
        console.log(`🌍 Environment: ${ENVIRONMENT}`);
        console.log(`📦 Project: ${config.projectName}`);
        console.log(`🔗 Ping: http://${host}:${port}/api/ping\n`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build)
 */
export const reqHandler = createApp().then((app) => createNodeRequestHandler(app));
