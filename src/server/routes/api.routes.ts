/**
 * API Routes Index
 * Registers all API route modules
 */
import { Router } from 'express';
import pingRoutes from './ping.routes';
import healthRoutes from './health.routes';
import oauthRoutes from './oauth.routes';
import { authMiddleware } from '../middleware/auth.middleware';
import { esPassthroughMiddleware } from '../middleware/proxy.middleware';

const router = Router();

// Ping route (public) - service identification
router.use('/ping', pingRoutes);

// Health check routes (public)
router.use('/health', healthRoutes);

// OAuth routes (public)
router.use('/oauth', oauthRoutes);

// ES passthrough (requires auth)
router.use('/es/:index/_search', authMiddleware, esPassthroughMiddleware);

// Example protected API route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
  });
});

// Add more route modules here as needed
// router.use('/users', authMiddleware, userRoutes);
// router.use('/data', authMiddleware, dataRoutes);

export default router;
