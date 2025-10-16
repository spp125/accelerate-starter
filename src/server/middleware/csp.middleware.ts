/**
 * Content Security Policy (CSP) Middleware
 * Configures security headers for the application
 */
import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';

/**
 * Build CSP header string from config
 */
function buildCSPHeader(): string {
  const directives = config.csp.directives;

  return Object.entries(directives)
    .map(([key, values]) => {
      // Convert camelCase to kebab-case
      const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * CSP Middleware
 * Sets Content-Security-Policy header
 */
export function cspMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!config.csp.enabled) {
    return next();
  }

  const cspHeader = buildCSPHeader();

  res.setHeader('Content-Security-Policy', cspHeader);

  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
}
