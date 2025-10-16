/**
 * Authentication Middleware
 * Handles JWT verification and user authentication
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Extend Express Request type to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roles: string[];
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'No authorization header' });
      return;
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      res.status(401).json({ error: 'Invalid authorization format' });
      return;
    }

    // TODO: Implement JWT verification
    // Example:
    // const jwt = require('jsonwebtoken');
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;

    // Mock user for now
    req.user = {
      id: 'mock-user-id',
      email: 'user@example.com',
      roles: ['user'],
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Optional auth middleware
 * Attaches user if token is present, but doesn't require it
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');

      if (bearer === 'Bearer' && token) {
        // TODO: Verify token and attach user
        req.user = {
          id: 'mock-user-id',
          email: 'user@example.com',
          roles: ['user'],
        };
      }
    }

    next();
  } catch (error) {
    // Ignore errors in optional auth
    next();
  }
}

/**
 * Role-based authorization middleware
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const hasRole = roles.some((role) => req.user?.roles.includes(role));

    if (!hasRole) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}
