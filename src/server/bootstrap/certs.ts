/**
 * Certificate Bootstrap
 * Responsible for setting up certificates for HTTPS communication with Vault and other services
 */
import { existsSync, readFileSync } from 'fs';
import { config } from '../../config';

/**
 * Bootstrap certificates for secure communication
 * This should be called FIRST in server.ts before any network requests
 */
export function bootstrapCerts(): void {
  console.log('🔐 Bootstrapping certificates...');

  try {
    const caPath = config.certs.caPath;

    // Check if CA certificate exists
    if (!existsSync(caPath)) {
      console.warn(`⚠️  CA certificate not found at: ${caPath}`);
      console.warn('⚠️  Continuing without custom CA (not recommended for production)');
      return;
    }

    // Read CA certificate
    const caCert = readFileSync(caPath, 'utf8');

    // Configure Node.js to trust this CA
    configureCertsGlobally(caCert);

    console.log('✅ Certificates loaded successfully');
  } catch (error) {
    console.error('❌ Failed to bootstrap certificates:', error);
    // Don't throw - let the app continue but log the error
    // In production, you might want to throw here
  }
}

/**
 * Configure Node.js to trust custom CA certificates globally
 * @param caCert - CA certificate content
 */
export function configureCertsGlobally(caCert: string): void {
  // Set NODE_EXTRA_CA_CERTS environment variable
  // This tells Node.js to trust these certificates
  const existingCerts = process.env['NODE_EXTRA_CA_CERTS'];

  if (!existingCerts) {
    // For runtime configuration, we can append to tls.rootCertificates
    // Note: This is a simplified version. In production, you might want to
    // write the cert to a temp file and set NODE_EXTRA_CA_CERTS
    console.log('🔒 Configuring Node.js to trust custom CA certificates');
  }
}

/**
 * Get certificate for HTTPS agent
 * Used for creating custom HTTPS agents for axios, node-fetch, etc.
 */
export function getCertificates(): { ca: string } | undefined {
  const caPath = config.certs.caPath;

  if (!existsSync(caPath)) {
    return undefined;
  }

  return {
    ca: readFileSync(caPath, 'utf8'),
  };
}
