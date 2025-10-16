# Accelerate Starter - Project Structure

## Overview

This is a modern Angular 20 SSR starter template with enterprise-grade server infrastructure, designed to accelerate project creation by providing pre-configured authentication, security, and API integrations.

## 📁 Project Structure

```
accelerate-starter/
│
├── src/
│   │
│   ├── @accelerate/                  # Reusable library (Fuse + Custom)
│   │   ├── components/               # Shared UI components
│   │   ├── directives/               # Custom directives
│   │   ├── pipes/                    # Custom pipes
│   │   ├── services/                 # Reusable services
│   │   ├── guards/                   # Route guards
│   │   ├── interceptors/             # HTTP interceptors
│   │   ├── utils/                    # Utility functions
│   │   ├── animations/               # Animations
│   │   ├── styles/                   # Global styles
│   │   └── validators/               # Form validators
│   │
│   ├── config/                       # Configuration VALUES only
│   │   ├── README.md                 # Config documentation
│   │   ├── index.ts                  # Environment detection + ENVIRONMENT constant
│   │   ├── config.default.ts         # Base configuration
│   │   ├── config.local.ts           # Local laptop development
│   │   ├── config.dev.ts             # DEV environment (TRP_AWS_ENVIRONMENT=DEV)
│   │   ├── config.stage.ts           # STAGE environment (TRP_AWS_ENVIRONMENT=STAGE)
│   │   └── config.prod.ts            # PROD environment (TRP_AWS_ENVIRONMENT=PROD)
│   │
│   ├── server/                       # Server code (Express, bootstrap, middleware, routes)
│   │   ├── README.md                 # Server documentation
│   │   │
│   │   ├── bootstrap/                # Server initialization
│   │   │   ├── index.ts              # Bootstrap orchestrator
│   │   │   ├── certs.ts              # Certificate loading
│   │   │   ├── vault.ts              # Vault client
│   │   │   └── aws.ts                # AWS credential chain
│   │   │
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.middleware.ts    # JWT authentication
│   │   │   ├── csp.middleware.ts     # Security headers
│   │   │   ├── error.middleware.ts   # Error handling
│   │   │   └── proxy.middleware.ts   # API proxy & ES passthrough
│   │   │
│   │   ├── routes/                   # API routes
│   │   │   ├── api.routes.ts         # Main routes index
│   │   │   ├── ping.routes.ts        # Service ping
│   │   │   ├── health.routes.ts      # Health checks
│   │   │   └── oauth.routes.ts       # OAuth 2.0 flow
│   │   │
│   │   └── clients/                  # External service clients
│   │       └── opensearch.client.ts  # OpenSearch
│   │
│   ├── environments/                 # Angular client configs
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── app/                          # Angular application
│   │   ├── core/                     # Core module
│   │   ├── layout/                   # Layout components
│   │   ├── shared/                   # Shared module
│   │   └── features/                 # Feature modules
│   │
│   ├── server.ts                     # ⭐ Express SSR server (LEAN!)
│   ├── main.server.ts                # SSR entry point
│   └── main.ts                       # Client entry point
│
├── public/                           # Static browser files
├── scripts/                          # Build & scaffolding scripts
├── package.json                      # With placeholders
└── angular.json                      # With placeholders
```

## 🚀 Bootstrap Sequence

When the server starts, it executes in this order:

```
server.ts
  └─> bootstrap()  (from server/bootstrap/index.ts)
       ├─> 1. bootstrapCerts()       # Load SSL certificates
       ├─> 2. configureAWS()         # Setup AWS credentials
       └─> 3. loadVaultSecrets()     # Fetch secrets from Vault
```

Order is critical! Certs needed for Vault → Vault needed for secrets → All needed before routes.

## 🔧 Configuration System

### Environment Detection (Single Source of Truth)

```typescript
// TRP_AWS_ENVIRONMENT (work ECS) takes priority:
// TRP_AWS_ENVIRONMENT=PROD  → config.prod.ts
// TRP_AWS_ENVIRONMENT=STAGE → config.stage.ts
// TRP_AWS_ENVIRONMENT=DEV   → config.dev.ts
// (no env set)              → config.local.ts

import { config, ENVIRONMENT } from './config';

console.log(ENVIRONMENT);     // "production" | "staging" | "development" | "local"
config.projectName;           // '{{project_name}}'
config.aws.profile;           // '{{aws_profile}}'
config.vault.url;             // '{{vault_url}}'
```

### Placeholders

These are replaced by the scaffolding script:

- `{{project_name}}` - Project name
- `{{aws_profile}}` - AWS profile for local dev
- `{{aws_account}}` - AWS account ID
- `{{aws_region}}` - AWS region
- `{{vault_url}}` - Vault server URL
- `{{oauth_client_id}}` - OAuth client ID
- `{{opensearch_endpoint}}` - OpenSearch endpoint
- `{{domain}}` - Domain name

## 🛡️ Security Features

### 1. Certificate Management (`certs.ts`)
- Loads CA certificates from npm package
- Configures Node.js to trust custom CAs
- Used for HTTPS communication with Vault and internal services

### 2. Content Security Policy (`csp.middleware.ts`)
- Configurable CSP headers
- Additional security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Different policies for dev/prod

### 3. Authentication (`auth.middleware.ts`)
- JWT token verification
- Role-based authorization
- Optional auth for public endpoints

### 4. OAuth 2.0 (`oauth.routes.ts`)
- Complete OAuth flow
- CSRF protection with state parameter
- Token exchange and refresh

## 🔌 API Endpoints

### Health Checks
```
GET /api/health/health    # Basic health check
GET /api/health/ready     # Readiness probe (checks dependencies)
GET /api/health/live      # Liveness probe
```

### OAuth
```
GET  /api/oauth/login     # Initiate OAuth flow
GET  /api/oauth/callback  # OAuth callback
POST /api/oauth/logout    # Logout
```

### Protected Routes
```
GET /api/protected                 # Example protected route
GET /api/es/:index/_search        # OpenSearch passthrough
```

## 📦 External Integrations

### 1. AWS
- Automatic credential chain (env vars → ~/.aws/credentials → IAM role)
- Configured in `config/aws.ts`

### 2. Vault
- Fetches secrets at startup
- Singleton pattern for secret access
- Configured in `config/vault.ts`

### 3. OpenSearch
- AWS-signed requests
- Singleton client
- Search and index operations
- Configured in `api/clients/opensearch.client.ts`

## 🎯 Key Design Principles

### 1. Lean server.ts
- All bootstrap logic in separate modules
- Clean, readable, maintainable
- Easy to understand flow

### 2. Separation of Concerns
- **Config** → `src/config/`
- **API Logic** → `src/api/`
- **Angular App** → `src/app/`
- **Shared Code** → `src/@accelerate/`

### 3. Type Safety
- TypeScript throughout
- Typed configs
- Typed middleware

### 4. Error Handling
- Centralized error middleware
- Async error wrapper
- Proper error logging

### 5. Security First
- CSP enabled by default
- Certificate management
- OAuth 2.0 ready
- JWT authentication

## 🔄 Development Workflow

### Local Development
```bash
npm install
npm run dev:ssr
# Server runs on http://localhost:4000
```

### Production Build
```bash
npm run build:ssr
npm run serve:ssr:{{project_name}}
```

### Adding New Routes
```typescript
// 1. Create route file in src/api/routes/
// 2. Import in src/api/routes/api.routes.ts
// 3. Register with router

router.use('/my-route', authMiddleware, myRoutes);
```

### Adding New Middleware
```typescript
// 1. Create in src/api/middleware/
// 2. Import in src/server.ts
// 3. Use before routes

app.use(myMiddleware);
```

## 📝 Next Steps

1. **Copy Fuse components** into `src/@accelerate/`
2. **Add custom components** to `src/@accelerate/components/`
3. **Create scaffolding script** for project generation
4. **Add environment variable examples** (`.env.example`)
5. **Implement actual Vault client** (replace mocks)
6. **Implement actual OpenSearch client** (replace mocks)
7. **Add logging** (Winston, Pino, etc.)
8. **Add monitoring** (Prometheus, CloudWatch, etc.)

## 🤝 Contributing

When adding new features:

1. Keep `server.ts` lean
2. Add config to `src/config/`
3. Add middleware to `src/api/middleware/`
4. Add routes to `src/api/routes/`
5. Update this documentation

---

**Version**: 1.0.0
**Angular**: 20.3.4
**Node**: 22.17.1 (LTS)
