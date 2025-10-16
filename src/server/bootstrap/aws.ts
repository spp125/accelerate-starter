/**
 * AWS Authentication Chain Configuration
 * Sets up AWS credentials using the SDK's default credential provider chain
 */
import { config } from '../../config';

/**
 * Configure AWS credentials
 * Uses AWS SDK's default credential provider chain:
 * 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
 * 2. Shared credentials file (~/.aws/credentials)
 * 3. IAM role (when running on EC2/ECS/Fargate)
 */
export function configureAWS(): void {
  console.log('☁️  Configuring AWS...');

  // Set AWS profile if specified (for local development)
  if (config.aws.profile) {
    process.env['AWS_PROFILE'] = config.aws.profile;
    console.log(`📋 Using AWS profile: ${config.aws.profile}`);
  }

  // Set AWS region
  if (config.aws.region) {
    process.env['AWS_REGION'] = config.aws.region;
    console.log(`🌍 Using AWS region: ${config.aws.region}`);
  }

  console.log('✅ AWS configuration complete');
}

/**
 * Get AWS credentials for a specific service
 * This is used when you need to manually create AWS SDK clients
 */
export function getAWSConfig() {
  return {
    region: config.aws.region,
    credentials: {
      // The AWS SDK will automatically use the credential provider chain
      // No need to explicitly provide credentials here
    },
  };
}
