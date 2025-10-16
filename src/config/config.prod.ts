/**
 * Production Environment Configuration
 *
 * This file contains configuration for the PRODUCTION environment.
 * Placeholders ({{...}}) will be replaced by the scaffolding script.
 *
 * Usage: NODE_ENV=production
 */
import { defaultConfig, type AppConfig } from './config.default';

export const prodConfig: AppConfig = {
  ...defaultConfig,

  environment: 'production',
  projectName: '{{project_name}}',
  version: '{{version}}',

  // AWS Configuration
  aws: {
    profile: '{{aws_profile_prod}}',
    account: '{{aws_account_prod}}',
    region: '{{aws_region}}',
  },

  // Vault Configuration
  vault: {
    url: '{{vault_url_prod}}',
    namespace: '{{vault_namespace}}',
    role: '{{vault_role}}',
    apiKeyPath: '/v1/auth/aws/troweprice/{{project_name}}/ecs-task/login',
  },

  // API Configuration
  api: {
    url: process.env['API_URL'] || 'https://{{project_name}}-api.{{domain}}',
    timeout: 30000,
  },

  // OpenSearch Configuration
  openSearch: {
    endpoint: '{{opensearch_endpoint_prod}}',
    region: '{{aws_region}}',
  },

  // OAuth Configuration
  oauth: {
    clientId: '{{oauth_client_id_prod}}',
    clientSecret: '{{oauth_client_secret_prod}}',
    redirectUri: 'https://{{project_name}}.{{domain}}/oauth/callback',
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
    port: parseInt(process.env['PORT'] || '8080', 10),
    host: process.env['HOST'] || '0.0.0.0',
  },

  // CSP - Strict for production
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", '{{project_name}}-api.{{domain}}'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
};
