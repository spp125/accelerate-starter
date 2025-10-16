# Configuration

This folder contains **configuration VALUES only** - no logic, no bootstrap code, just settings.

## ⭐ Single Source of Truth: ENVIRONMENT

The environment is detected ONCE and used everywhere:

```typescript
import { ENVIRONMENT, config } from './config';

// ✅ DO: Use ENVIRONMENT constant
if (ENVIRONMENT === 'production') { ... }

// ❌ DON'T: Read env vars directly
if (process.env.NODE_ENV === 'production') { ... }  // Wrong!
```

## Environment Detection Priority

1. **TRP_AWS_ENVIRONMENT** (work ECS) - `"PROD"` / `"STAGE"` / `"DEV"`
   - `PROD` → `"production"` → `config.prod.ts`
   - `STAGE` → `"staging"` → `config.stage.ts`
   - `DEV` → `"development"` → `config.dev.ts`
2. **NODE_ENV** (override) - e.g., `"local"` → `"local"`
3. **Default**: `"local"` → `config.local.ts` (for local laptop development)

## How It Works

The config system uses a **layered approach**:

```
config.default.ts        ← Base values (always loaded)
       ↓
config.{env}.ts          ← Environment-specific (overrides defaults)
       ↓
Environment Variables    ← Runtime overrides (highest priority)
```

## Files

### `index.ts`
- Maps `TRP_AWS_ENVIRONMENT` → environment names
- Auto-selects the correct config
- Exports `ENVIRONMENT` constant (single source of truth)
- **Usage**: `import { config, ENVIRONMENT } from './config'`

### `config.default.ts`
- Base configuration values
- TypeScript interface for type safety
- Contains all possible config keys with defaults
- **Never edit for environment-specific values**

### `config.local.ts`
- **Local laptop development** (when no TRP_AWS_ENVIRONMENT is set)
- Used when running on your laptop: `npm run dev:ssr`
- Can have personal settings, test credentials, etc.
- **Committed to repo** - team's default local config

### `config.dev.ts`
- **Development environment** (ECS: `TRP_AWS_ENVIRONMENT=DEV`)
- Used in AWS ECS DEV environment
- Contains placeholders like `{{project_name}}`

### `config.stage.ts`
- **Staging environment** (ECS: `TRP_AWS_ENVIRONMENT=STAGE`)
- Used in AWS ECS STAGE environment

### `config.prod.ts`
- **Production environment** (ECS: `TRP_AWS_ENVIRONMENT=PROD`)
- Used in AWS ECS PROD environment

## Placeholders

Some values contain placeholders that are replaced by the scaffolding script:

- `{{project_name}}` → Project name
- `{{aws_profile}}` → AWS profile for local dev
- `{{aws_account}}` → AWS account ID
- `{{vault_url}}` → Vault server URL
- `{{oauth_client_id}}` → OAuth client ID
- etc.

## Usage

```typescript
import { config, ENVIRONMENT } from './config';

// Check environment (single source of truth)
console.log(ENVIRONMENT);              // "development"

// Access configuration
console.log(config.projectName);       // "my-project"
console.log(config.aws.profile);       // "dev-profile"
console.log(config.vault.url);         // "https://vault.dev.example.com"

// Conditional logic based on environment
if (ENVIRONMENT === 'production') {
  // Production-only code
}
```

### Real-World Examples:

**ECS Production:**
```bash
TRP_AWS_ENVIRONMENT=PROD      # ← Work ECS env var
         ↓
ENVIRONMENT="production"      # ← Our constant
         ↓
Uses config.prod.ts           # ← Selected config
```

**ECS Dev:**
```bash
TRP_AWS_ENVIRONMENT=DEV       # ← Work ECS env var
         ↓
ENVIRONMENT="development"     # ← Our constant
         ↓
Uses config.dev.ts            # ← Selected config
```

**Local Laptop Development:**
```bash
(no env vars set)             # ← Your laptop
         ↓
ENVIRONMENT="local"           # ← Default
         ↓
Uses config.local.ts          # ← Selected config
```

## Environment Variables

You can override any config value with environment variables:

```bash
# Override port
PORT=3000 npm run dev:ssr

# Override API URL
API_URL=https://custom-api.com npm run dev:ssr
```

## Adding New Config Values

1. Add to `config.default.ts` with a sensible default
2. Override in environment-specific files as needed
3. Update TypeScript types in `config.default.ts`

## ⚠️ What NOT to Put Here

- ❌ Bootstrap logic (certificates, vault setup, etc.)
- ❌ Client initialization code
- ❌ Middleware functions
- ✅ Only configuration values (strings, numbers, objects)

For bootstrap logic, see `src/server/bootstrap/`
