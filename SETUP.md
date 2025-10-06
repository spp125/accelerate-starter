# Accelerate Starter - Setup Guide

This guide will help you replicate the Angular SSR starter project setup on any machine.

## Prerequisites

### Required Software

1. **Node.js LTS** (v22.17.1 or later)
   ```bash
   # Check your Node version
   node --version

   # Install Node.js LTS from https://nodejs.org/
   # Or use nvm:
   nvm install --lts
   nvm use --lts
   ```

2. **npm** (v10.9.2 or later - comes with Node.js)
   ```bash
   npm --version
   ```

3. **Git**
   ```bash
   git --version
   ```

4. **GitHub CLI** (optional, but recommended)
   ```bash
   # macOS
   brew install gh

   # Windows
   winget install --id GitHub.cli

   # Login to GitHub
   gh auth login
   ```

## Step 1: Create New Angular SSR Project

```bash
# Create a new Angular project with SSR enabled
npx @angular/cli@latest new accelerate-starter --ssr --routing --style=scss --skip-git

# What this does:
# --ssr: Enables Server-Side Rendering
# --routing: Adds Angular Router
# --style=scss: Uses SCSS for styling
# --skip-git: We'll initialize git manually
```

## Step 2: Navigate to Project

```bash
cd accelerate-starter
```

## Step 3: Verify Project Structure

Your project should have these key files:
```
accelerate-starter/
├── src/
│   ├── app/
│   │   ├── app.config.server.ts    # SSR configuration
│   │   ├── app.routes.server.ts    # SSR routes
│   │   └── ...
│   ├── server.ts                   # SSR Express server
│   ├── main.server.ts              # SSR entry point
│   └── main.ts                     # Client entry point
├── angular.json
├── package.json
└── tsconfig.json
```

## Step 4: Initialize Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Angular 20 SSR project

- Angular CLI 20.3.4
- Server-Side Rendering enabled
- Node 22.17.1 (LTS)
- SCSS styling
- Routing enabled"
```

## Step 5: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
# Create and push in one command
gh repo create accelerate-starter \
  --public \
  --source=. \
  --description="Angular 20 SSR starter template" \
  --push
```

If SSH fails, change remote to HTTPS:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/accelerate-starter.git
git push -u origin main
```

### Option B: Manual Setup

1. Go to https://github.com/new
2. Create repository named `accelerate-starter`
3. Don't initialize with README (we already have files)
4. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/accelerate-starter.git
git branch -M main
git push -u origin main
```

## Step 6: Test the Setup

```bash
# Install dependencies (if not already installed)
npm install

# Run development server (SSR)
npm run dev:ssr

# Your app should be running at http://localhost:4200
```

## Step 7: Build for Production

```bash
# Build with SSR
npm run build:ssr

# This creates dist/ folder with:
# - dist/browser/     (Client-side files)
# - dist/server/      (SSR server files including index.mjs)

# Run production build
npm run serve:ssr:accelerate-starter
```

## Project Information

- **Angular Version**: 20.3.4
- **Node Version**: 22.17.1 (LTS)
- **Package Manager**: npm 10.9.2
- **Rendering**: SSR (Server-Side Rendering)
- **Styling**: SCSS
- **Routing**: Enabled

## Available Scripts

```bash
npm start              # Development server (client-only)
npm run dev:ssr        # Development server with SSR
npm run build          # Build for production (client-only)
npm run build:ssr      # Build for production with SSR
npm run serve:ssr      # Serve SSR production build
npm test               # Run unit tests
```

## Next Steps

After setting up the base project:

1. **Add Fuse Angular components** to `src/@fuse/`
2. **Create `src/@accelerate/`** for custom reusable components
3. **Add Express server** in `server/` directory for API routes
4. **Configure environment variables** for AWS, vault, etc.
5. **Create setup script** for project scaffolding with placeholders

## Troubleshooting

### Port 4200 already in use
```bash
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9
```

### Node version mismatch
```bash
# Use nvm to switch Node versions
nvm use 22
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Repository

- **GitHub**: https://github.com/spp125/accelerate-starter
- **Branch**: main

---

Created: 2025-10-06
Last Updated: 2025-10-06
