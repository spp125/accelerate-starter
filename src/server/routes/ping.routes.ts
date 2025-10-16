/**
 * Ping Route
 * Quick service identification and status check
 */
import { Router, Request, Response } from 'express';
import { config, ENVIRONMENT } from '../../config';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// Track server start time for uptime calculation
const startTime = Date.now();

/**
 * Ping endpoint - returns service identification and basic status
 * This is useful for:
 * - Verifying the service is running
 * - Identifying which service/version is deployed
 * - Quick environment check
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    res.json({
      service: config.projectName,
      version: config.version,
      environment: ENVIRONMENT,
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      aws: {
        region: config.aws.region,
      },
      node: {
        version: process.version,
        platform: process.platform,
      },
    });
  })
);

export default router;
