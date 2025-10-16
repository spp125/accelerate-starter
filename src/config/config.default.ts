/**
 * Default Configuration
 *
 * This file contains base configuration values that are shared across all environments.
 * Environment-specific configs (dev, stage, prod) will override these values.
 *
 * IMPORTANT: Only configuration VALUES here - no logic, no functions, no classes.
 */

export interface AppConfig {
  // Project Info
  projectName: string;
  environment: string;
  version: string;

  // AWS Configuration
  aws: {
    profile: string;
    account: string;
    region: string;
  };

  // Vault Configuration
  vault: {
    url: string;
    namespace: string;
    role: string;
    apiKeyPath: string;
  };

  // API Configuration
  api: {
    url: string;
    timeout: number;
  };

  // OpenSearch Configuration
  openSearch: {
    endpoint: string;
    region: string;
  };

  // OAuth Configuration
  oauth: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    authorizationUrl: string;
    tokenUrl: string;
    scope: string;
  };

  // Certificate Configuration
  certs: {
    npmPackage: string;
    caPath: string;
    authPackage: string;
    authResourcesPath: string;
  };

  // Server Configuration
  server: {
    port: number;
    host: string;
  };

  // CSP (Content Security Policy) Configuration
  csp: {
    enabled: boolean;
    directives: {
      defaultSrc: string[];
      scriptSrc: string[];
      styleSrc: string[];
      imgSrc: string[];
      connectSrc: string[];
      fontSrc: string[];
      objectSrc: string[];
      mediaSrc: string[];
      frameSrc: string[];
    };
  };
}

/**
 * Default configuration values
 * These are used as fallbacks when environment-specific configs don't provide values
 */
export const defaultConfig: AppConfig = {
  // Project Info
  projectName: 'accelerate-starter',
  environment: 'development',
  version: '1.0.0',

  // AWS Configuration
  aws: {
    profile: process.env['AWS_PROFILE'] || '',
    account: process.env['AWS_ACCOUNT'] || '',
    region: process.env['AWS_REGION'] || 'us-east-1',
  },

  // Vault Configuration
  vault: {
    url: process.env['VAULT_URL'] || '',
    namespace: process.env['VAULT_NAMESPACE'] || '',
    role: process.env['VAULT_ROLE'] || '',
    apiKeyPath: '/v1/auth/aws/troweprice',
  },

  // API Configuration
  api: {
    url: process.env['API_URL'] || 'http://localhost:3000',
    timeout: 30000,
  },

  // OpenSearch Configuration
  openSearch: {
    endpoint: process.env['OPENSEARCH_ENDPOINT'] || '',
    region: process.env['AWS_REGION'] || 'us-east-1',
  },

  // OAuth Configuration
  oauth: {
    clientId: process.env['OAUTH_CLIENT_ID'] || '',
    clientSecret: process.env['OAUTH_CLIENT_SECRET'] || '',
    redirectUri: '',
    authorizationUrl: '',
    tokenUrl: '',
    scope: 'openid profile email',
  },

  // Certificate Configuration
  certs: {
    npmPackage: '@trp-ta-nitro/cacerts-nodejs',
    caPath: 'node_modules/@trp-ta-nitro/cacerts-nodejs/resources/cacerts.crt',
    authPackage: '@trp-ta-nitro/auth-nodejs',
    authResourcesPath: 'node_modules/@trp-ta-nitro/auth-nodejs/resources',
  },

  // Server Configuration
  server: {
    port: parseInt(process.env['PORT'] || '4000', 10),
    host: process.env['HOST'] || 'localhost',
  },

  // CSP Configuration
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
};
