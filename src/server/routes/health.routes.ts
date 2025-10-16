/**
 * Health Check Routes
 * Provides health and readiness endpoints for load balancers
 */
import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

/**
 * Basic health check
 * Returns 200 if server is running
 */
router.get(
  '/health',
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * Readiness check
 * Returns 200 if server is ready to accept traffic
 */
router.get(
  '/ready',
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Check dependencies (DB, Redis, etc.)
    const checks = {
      database: true, // await checkDatabase()
      cache: true, // await checkCache()
      vault: true, // await checkVault()
    };

    const isReady = Object.values(checks).every((check) => check === true);

    res.status(isReady ? 200 : 503).json({
      ready: isReady,
      checks,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * Liveness check
 * Returns 200 if server is alive
 */
router.get(
  '/live',
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      alive: true,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
