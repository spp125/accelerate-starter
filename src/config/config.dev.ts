/**
 * Development Environment Configuration
 *
 * This file contains configuration for the DEV environment.
 * Placeholders ({{...}}) will be replaced by the scaffolding script.
 *
 * Usage: NODE_ENV=development
 */
import { defaultConfig, type AppConfig } from './config.default';

export const devConfig: AppConfig = {
  ...defaultConfig,

  environment: 'development',
  projectName: '{{project_name}}',
  version: '{{version}}',

  // AWS Configuration
  aws: {
    profile: '{{aws_profile}}',
    account: '{{aws_account}}',
    region: '{{aws_region}}',
  },

  // Vault Configuration
  vault: {
    url: '{{vault_url}}',
    namespace: '{{vault_namespace}}',
    role: '{{vault_role}}',
    apiKeyPath: '/v1/auth/aws/troweprice/{{project_name}}/ecs-task/login',
  },

  // API Configuration
  api: {
    url: process.env['API_URL'] || 'https://{{project_name}}-api-dev.{{domain}}',
    timeout: 30000,
  },

  // OpenSearch Configuration
  openSearch: {
    endpoint: '{{opensearch_endpoint_dev}}',
    region: '{{aws_region}}',
  },

  // OAuth Configuration
  oauth: {
    clientId: '{{oauth_client_id}}',
    clientSecret: '{{oauth_client_secret}}',
    redirectUri: 'https://{{project_name}}-dev.{{domain}}/oauth/callback',
    authorizationUrl: '{{oauth_auth_url}}',
    tokenUrl: '{{oauth_token_url}}',
    scope: 'openid profile email',
  },

  // Certificate paths (from npm packages)
  certs: {
    ...defaultConfig.certs,
  },

  // Server Configuration
  server: {
    port: parseInt(process.env['PORT'] || '4000', 10),
    host: process.env['HOST'] || '0.0.0.0',
  },

  // CSP - Relaxed for development
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", '{{project_name}}-api-dev.{{domain}}'],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
};
