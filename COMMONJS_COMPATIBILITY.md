# CommonJS Package Compatibility

Angular 20 uses ESM (ES Modules) by default, but some internal packages may still use CommonJS format. This document explains how to handle CommonJS packages in our ESM build.

## The Problem

```typescript
// Internal package (CommonJS)
@trp-ta-nitro/cacerts-nodejs → module.exports = { ... }

// Angular 20 (ESM)
import { certs } from '@trp-ta-nitro/cacerts-nodejs'  ❌ Error!
```

**Error you might see:**
```
require is not defined in ES module scope
```

## Our Solution

We use a **hybrid approach**:

1. **Dynamic imports** for CommonJS packages in server code
2. **Angular build configuration** to allow CommonJS dependencies
3. **Async bootstrap** to handle dynamic imports properly

---

## Implementation

### 1. Server Bootstrap (Dynamic Import)

All CommonJS packages are imported dynamically in `src/server/bootstrap/`:

```typescript
// src/server/bootstrap/certs.ts

/**
 * Bootstrap certificates (handles CommonJS packages)
 */
export async function bootstrapCerts(): Promise<void> {
  console.log('🔐 Bootstrapping certificates...');

  try {
    // ✅ Dynamic import works with CommonJS
    const cacertsModule = await import('@trp-ta-nitro/cacerts-nodejs');
    const cacerts = cacertsModule.default || cacertsModule;

    // Use the module
    const caPath = cacerts.getCertPath();
    // ... rest of logic

  } catch (error) {
    console.error('❌ Failed to load certs:', error);
  }
}
```

### 2. Angular Configuration

Tell Angular which CommonJS packages are allowed:

```json
// angular.json
{
  "projects": {
    "{{project_name}}": {
      "architect": {
        "build": {
          "options": {
            "allowedCommonJsDependencies": [
              "@trp-ta-nitro/cacerts-nodejs",
              "@trp-ta-nitro/auth-nodejs",
              "vault-client"
            ]
          }
        }
      }
    }
  }
}
```

### 3. TypeScript Configuration

Ensure TypeScript supports this pattern:

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

---

## Adding New CommonJS Packages

When you need to use a new CommonJS package:

### Step 1: Add to `angular.json`
```json
"allowedCommonJsDependencies": [
  "@trp-ta-nitro/cacerts-nodejs",
  "@trp-ta-nitro/auth-nodejs",
  "your-new-package"  // ← Add here
]
```

### Step 2: Use Dynamic Import in Server Code
```typescript
// src/server/bootstrap/your-feature.ts

export async function initYourFeature(): Promise<void> {
  // Dynamic import for CommonJS compatibility
  const module = await import('your-new-package');
  const yourPackage = module.default || module;

  // Use it
  yourPackage.doSomething();
}
```

### Step 3: Update Bootstrap Sequence
```typescript
// src/server/bootstrap/index.ts

export async function bootstrap(): Promise<void> {
  await bootstrapCerts();
  await configureAWS();
  await loadVaultSecrets();
  await initYourFeature();  // ← Add here
}
```

---

## Important Rules

### ✅ DO:
- Use CommonJS packages **only in `src/server/`** (Node.js server code)
- Use **dynamic imports** (`await import()`) for CommonJS packages
- Add packages to `allowedCommonJsDependencies` in `angular.json`
- Make bootstrap functions **async** to support dynamic imports

### ❌ DON'T:
- Import CommonJS packages in `src/app/` (Angular components)
- Use `require()` syntax (stick to dynamic imports for consistency)
- Import CommonJS packages statically (`import x from 'package'`)
- Forget to add to `allowedCommonJsDependencies`

---

## Examples

### ✅ Good: Dynamic Import in Server Code

```typescript
// src/server/bootstrap/vault.ts

export async function loadVaultSecrets(): Promise<void> {
  // Dynamic import - works with CommonJS
  const vaultModule = await import('vault-client');
  const VaultClient = vaultModule.default || vaultModule;

  const client = new VaultClient(config.vault.url);
  await client.login();
}
```

### ❌ Bad: Static Import

```typescript
// src/server/bootstrap/vault.ts

// ❌ This will fail with CommonJS packages
import VaultClient from 'vault-client';

export function loadVaultSecrets(): void {
  const client = new VaultClient(config.vault.url);
}
```

### ❌ Bad: Using in Angular Components

```typescript
// src/app/my-component/my-component.ts

// ❌ NEVER import CommonJS packages in Angular components!
import { certs } from '@trp-ta-nitro/cacerts-nodejs';

export class MyComponent {
  // This will break the build
}
```

---

## Build Warnings

You may see warnings like:
```
Warning: [package-name] depends on 'module-name'.
CommonJS or AMD dependencies can cause optimization bailouts.
```

**This is normal** if the package is:
1. Listed in `allowedCommonJsDependencies`
2. Only used in server code (`src/server/`)
3. Not bundled with the client-side Angular app

You can safely ignore these warnings.

---

## Troubleshooting

### Error: "Cannot use import statement outside a module"

**Solution**: Use dynamic import instead of static import:
```typescript
// ❌ Bad
import pkg from 'commonjs-package';

// ✅ Good
const pkgModule = await import('commonjs-package');
const pkg = pkgModule.default || pkgModule;
```

### Error: "require is not defined"

**Solution**:
1. Don't use `require()` syntax
2. Use dynamic imports instead
3. Make sure function is `async`

### Build Error: "CommonJS or AMD dependencies..."

**Solution**: Add package to `allowedCommonJsDependencies` in `angular.json`

### Package not found at runtime

**Solution**: Make sure the package is in `dependencies` (not `devDependencies`) in `package.json`

---

## Package Types

### ESM Packages (Modern)
- Can be imported normally
- Work everywhere (client & server)
- No special handling needed

### CommonJS Packages (Legacy)
- Need dynamic imports
- Server-side only
- Add to `allowedCommonJsDependencies`

### Checking Package Type

```bash
# Check package type
cat node_modules/package-name/package.json | grep "type"

# If "type": "module" → ESM ✅
# If "type": "commonjs" or no "type" → CommonJS ⚠️
```

---

## Summary

1. **CommonJS packages** → Use only in `src/server/`
2. **Dynamic imports** → `await import('package')`
3. **Configure Angular** → Add to `allowedCommonJsDependencies`
4. **Async bootstrap** → Make functions `async` to support dynamic imports

Following these rules ensures smooth compatibility between ESM (Angular 20) and CommonJS (internal packages).

---

## References

- [Angular - CommonJS Dependencies](https://angular.io/guide/build#configuring-commonjs-dependencies)
- [Node.js - ES Modules](https://nodejs.org/api/esm.html)
- [TypeScript - Dynamic Imports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html#dynamic-import-expressions)

---

**Last Updated**: 2025-10-15
**Angular Version**: 20.3.4
**Node Version**: 22.17.1 (LTS)
