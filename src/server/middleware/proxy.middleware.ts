/**
 * Proxy Middleware
 * Handles proxying requests to backend services
 */
import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';
import { getCertificates } from '../bootstrap/certs';

/**
 * Create proxy middleware for API requests
 * This forwards requests to the backend API server
 */
export function createProxyMiddleware(targetUrl?: string) {
  const target = targetUrl || config.api.url;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certs = getCertificates();

      // TODO: Implement actual proxy using http-proxy-middleware or axios
      // Example:
      // const { createProxyMiddleware } = require('http-proxy-middleware');
      // return createProxyMiddleware({
      //   target,
      //   changeOrigin: true,
      //   secure: true,
      //   ssl: certs,
      //   onProxyReq: (proxyReq, req, res) => {
      //     // Add custom headers
      //     proxyReq.setHeader('X-Forwarded-For', req.ip);
      //   },
      // })(req, res, next);

      console.log(`🔄 Proxying ${req.method} ${req.path} to ${target}`);

      // Mock response for now
      res.status(200).json({
        message: 'Proxy response (mock)',
        proxiedTo: target,
        path: req.path,
      });
    } catch (error) {
      next(error);
    }
  };
}

/**
 * ES (Elasticsearch/OpenSearch) Pass-through middleware
 * Forwards ES queries to OpenSearch with proper authentication
 */
export function esPassthroughMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    console.log(`🔍 ES passthrough: ${req.method} ${req.path}`);

    // TODO: Implement ES passthrough using openSearchClient
    // Example:
    // const { openSearchClient } = require('../clients/opensearch.client');
    // const result = await openSearchClient.search(req.params.index, req.body);
    // res.json(result);

    // Mock response for now
    res.status(200).json({
      message: 'ES passthrough (mock)',
      method: req.method,
      path: req.path,
    });
  } catch (error) {
    next(error);
  }
}
