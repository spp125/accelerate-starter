/**
 * Configuration Index
 *
 * ⭐ SINGLE SOURCE OF TRUTH for environment detection
 *
 * Automatically selects and exports the correct configuration based on:
 * 1. TRP_AWS_ENVIRONMENT (work ECS convention) - PRIORITY
 * 2. NODE_ENV (local development fallback)
 *
 * Supported environments:
 * - local (default when no env is set)
 * - development
 * - staging
 * - production
 *
 * Usage:
 *   import { config, ENVIRONMENT } from './config';
 *   console.log(ENVIRONMENT);        // "development"
 *   console.log(config.projectName); // "my-project"
 */

import { type AppConfig } from './config.default';
import { localConfig } from './config.local';
import { devConfig } from './config.dev';
import { stageConfig } from './config.stage';
import { prodConfig } from './config.prod';

/**
 * Available environment names (lowercase)
 */
type Environment = 'local' | 'development' | 'staging' | 'production';

/**
 * Map of environment names to their configurations
 */
const configs: Record<Environment, AppConfig> = {
  local: localConfig,
  development: devConfig,
  staging: stageConfig,
  production: prodConfig,
} as const;

/**
 * Map TRP_AWS_ENVIRONMENT values to our environment names
 * Work ECS convention: PROD, STAGE, DEV (uppercase, short)
 */
const TRP_ENV_MAP: Record<string, Environment> = {
  PROD: 'production',
  STAGE: 'staging',
  DEV: 'development',
  LOCAL: 'local',
};

/**
 * Get the current environment from environment variables
 *
 * Priority:
 * 1. TRP_AWS_ENVIRONMENT (work ECS) - e.g., "PROD" → "production"
 * 2. NODE_ENV (local dev)           - e.g., "local" → "local"
 * 3. Default to 'local' (for local laptop development)
 */
function getCurrentEnvironment(): Environment {
  // Priority 1: Check TRP_AWS_ENVIRONMENT (work ECS convention)
  const trpEnv = process.env['TRP_AWS_ENVIRONMENT']?.toUpperCase();
  if (trpEnv && trpEnv in TRP_ENV_MAP) {
    return TRP_ENV_MAP[trpEnv];
  }

  // Priority 2: Check NODE_ENV (local development)
  const nodeEnv = process.env['NODE_ENV']?.toLowerCase();
  if (nodeEnv && nodeEnv in configs) {
    return nodeEnv as Environment;
  }

  // Priority 3: Default to 'local' (for local laptop development)
  if (!trpEnv && !nodeEnv) {
    return 'local';
  }

  // Invalid environment - warn and fallback
  const attemptedEnv = trpEnv || nodeEnv;
  console.warn(
    `⚠️  Unknown environment: "${attemptedEnv}". ` +
      `Valid TRP_AWS_ENVIRONMENT values: ${Object.keys(TRP_ENV_MAP).join(', ')}. ` +
      `Valid NODE_ENV values: ${Object.keys(configs).join(', ')}. ` +
      `Falling back to 'local'.`
  );
  return 'local';
}

/**
 * ⭐ SINGLE SOURCE OF TRUTH: Current environment name
 *
 * Use this constant everywhere you need to check the environment.
 * DO NOT read TRP_AWS_ENVIRONMENT or NODE_ENV directly elsewhere.
 *
 * Example:
 *   if (ENVIRONMENT === 'production') { ... }
 */
export const ENVIRONMENT = getCurrentEnvironment();

/**
 * Selected configuration for the current environment
 *
 * This is the main export - use this to access configuration values
 */
export const config = configs[ENVIRONMENT];

/**
 * Export type for use in other files
 */
export type { AppConfig } from './config.default';

/**
 * Set NODE_ENV to match our environment for consistency
 * This ensures libraries that rely on NODE_ENV work correctly
 */
if (ENVIRONMENT === 'production' || ENVIRONMENT === 'staging') {
  process.env['NODE_ENV'] = 'production';
} else {
  process.env['NODE_ENV'] = 'development';
}

/**
 * Log current configuration on import (useful for debugging)
 */
if (process.env['DEBUG_CONFIG']) {
  console.log('\n📝 Configuration loaded:');
  console.log(`   Environment: ${ENVIRONMENT}`);
  console.log(`   TRP_AWS_ENVIRONMENT: ${process.env['TRP_AWS_ENVIRONMENT'] || '(not set)'}`);
  console.log(`   NODE_ENV: ${process.env['NODE_ENV']}`);
  console.log(`   Project: ${config.projectName}`);
  console.log(`   Server: ${config.server.host}:${config.server.port}`);
  console.log(`   AWS Region: ${config.aws.region}\n`);
}
