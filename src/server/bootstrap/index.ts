/**
 * Server Bootstrap Orchestrator
 *
 * This file coordinates all server initialization in the correct order.
 * Think of this as the "startup checklist" for the server.
 *
 * Order matters! Don't change the sequence without understanding dependencies.
 */

import { bootstrapCerts } from './certs';
import { configureAWS } from './aws';
import { loadVaultSecrets } from './vault';

/**
 * Bootstrap the server
 *
 * This function MUST be called before starting the Express server.
 * It initializes all dependencies in the correct order.
 *
 * Order:
 * 1. Certificates (needed for HTTPS to Vault)
 * 2. AWS credentials (needed for AWS services)
 * 3. Vault secrets (needs certs and AWS)
 * 4. Other clients (need secrets from Vault)
 *
 * @throws Error if any bootstrap step fails
 */
export async function bootstrap(): Promise<void> {
  console.log('🚀 Starting server bootstrap...\n');

  try {
    // Step 1: Load certificates FIRST (needed for HTTPS requests)
    console.log('📝 Step 1/3: Loading certificates...');
    bootstrapCerts();

    // Step 2: Configure AWS credentials
    console.log('📝 Step 2/3: Configuring AWS...');
    configureAWS();

    // Step 3: Load secrets from Vault
    console.log('📝 Step 3/3: Loading Vault secrets...');
    await loadVaultSecrets();

    console.log('\n✅ Server bootstrap completed successfully\n');
  } catch (error) {
    console.error('\n❌ Server bootstrap failed:', error);
    throw error;
  }
}

// Re-export individual functions for direct use if needed
export { bootstrapCerts } from './certs';
export { configureAWS } from './aws';
export { loadVaultSecrets, vaultClient } from './vault';
export { getCertificates } from './certs';
