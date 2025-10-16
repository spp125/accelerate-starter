/**
 * Local Development Configuration
 *
 * This file is for YOUR local develn                                   kmn opment environment.
 * It should be added to .gitignore so each developer can have their own settings.
 *
 * Usage: NODE_ENV=local or no NODE_ENV set
 */
import { defaultConfig, type AppConfig } from './config.default';

export const localConfig: AppConfig = {
  ...defaultConfig,

  environment: 'local',

  // Override project name for local testing
  projectName: 'accelerate-local',

  // AWS - Use your local profile
  aws: {
    ...defaultConfig.aws,
    profile: process.env['AWS_PROFILE'] || 'default',
    account: process.env['AWS_ACCOUNT'] || '',
    region: 'us-east-1',
  },

  // Vault - Point to dev vault for local testing
  vault: {
    ...defaultConfig.vault,
    url: process.env['VAULT_URL'] || 'https://vault.dev.example.com',
    namespace: 'dev',
    role: 'local-dev-role',
  },

  // API - Local backend
  api: {
    url: process.env['API_URL'] || 'http://localhost:3000',
    timeout: 30000,
  },

  // OpenSearch - Point to dev cluster
  openSearch: {
    endpoint: process.env['OPENSEARCH_ENDPOINT'] || 'https://opensearch.dev.example.com',
    region: 'us-east-1',
  },

  // OAuth - Use dev OAuth credentials
  oauth: {
    ...defaultConfig.oauth,
    clientId: process.env['OAUTH_CLIENT_ID'] || 'local-client-id',
    clientSecret: process.env['OAUTH_CLIENT_SECRET'] || '',
    redirectUri: 'http://localhost:4000/oauth/callback',
    authorizationUrl: 'https://auth.dev.example.com/oauth/authorize',
    tokenUrl: 'https://auth.dev.example.com/oauth/token',
  },

  // Server - Local port
  server: {
    port: parseInt(process.env['PORT'] || '4000', 10),
    host: 'localhost',
  },

  // CSP - Relaxed for local development
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Relaxed for HMR
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      connectSrc: ["'self'", 'ws://localhost:*', 'http://localhost:*'], // For dev server
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
};
