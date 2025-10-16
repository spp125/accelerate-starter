# Server

This folder contains all Express server code - bootstrap logic, middleware, routes, and clients.

## Structure

```
server/
├── bootstrap/          # Server initialization (runs before app starts)
│   ├── index.ts       # Main bootstrap orchestrator
│   ├── certs.ts       # Certificate loading
│   ├── vault.ts       # Vault client setup
│   └── aws.ts         # AWS credential chain
│
├── middleware/        # Express middleware
│   ├── auth.middleware.ts    # JWT authentication
│   ├── csp.middleware.ts     # Security headers
│   ├── error.middleware.ts   # Error handling
│   └── proxy.middleware.ts   # API proxy & ES passthrough
│
├── routes/            # API routes
│   ├── api.routes.ts         # Main routes index
│   ├── ping.routes.ts        # Service ping (/api/ping)
│   ├── health.routes.ts      # Health checks (/api/health/*)
│   └── oauth.routes.ts       # OAuth flow (/api/oauth/*)
│
└── clients/           # External service clients
    └── opensearch.client.ts  # OpenSearch client
```

## Bootstrap Sequence

When the server starts (`server.ts`), it executes bootstrap in this order:

```
1. bootstrapCerts()        → Load SSL certificates
2. configureAWS()          → Setup AWS credentials
3. loadVaultSecrets()      → Fetch secrets from Vault
4. Start Express server    → Routes & middleware ready
```

This order is critical! Don't change it without understanding dependencies.

## Adding New Code

### Add a new route:
```typescript
// 1. Create: server/routes/my-feature.routes.ts
// 2. Register in: server/routes/api.routes.ts
router.use('/my-feature', myFeatureRoutes);
```

### Add a new middleware:
```typescript
// 1. Create: server/middleware/my-middleware.ts
// 2. Use in: server.ts
app.use(myMiddleware);
```

### Add a new client:
```typescript
// 1. Create: server/clients/my-service.client.ts
// 2. Initialize in: server/bootstrap/index.ts
await initializeMyService();
```

## Key Principles

1. **Bootstrap before routes** - All clients/secrets loaded before handling requests
2. **Singletons for clients** - One instance per service (Vault, OpenSearch, etc.)
3. **Separation of concerns** - Bootstrap ≠ Middleware ≠ Routes
4. **Type safety** - Use TypeScript interfaces for all clients

## See Also

- `../config/README.md` - Configuration system
- `../server.ts` - Main Express server entry point
- `PROJECT_STRUCTURE.md` - Full project architecture
