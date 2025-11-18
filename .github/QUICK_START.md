# Quick Start Guide

## 🚀 Publish to GitHub (First Time)

```bash
# 1. Create repo on GitHub (don't initialize with files)

# 2. In your project directory:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# 3. Enable GitHub Pages:
# Go to: Settings → Pages → Source: GitHub Actions
```

## 🔄 Daily Development Workflow

```bash
# Make changes to your code
git add .
git commit -m "feat: your change description"
git push origin main

# CI/CD automatically runs:
# ✅ Lint → ✅ Tests → ✅ Build → ✅ Deploy
```

## 🧪 Run Tests Locally Before Push

```bash
# Run all checks
npm run lint              # Check code quality
npm run test              # Run unit tests
npm run test:coverage     # Run tests with coverage
npm run e2e:headless      # Run E2E tests
npm run build             # Test production build

# Fix issues
npm run lint:fix          # Auto-fix lint issues
npm run format            # Format code
```

## 📊 View Your Site

After deployment completes (5-10 minutes):

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## 🔍 Check Deployment Status

1. Go to your GitHub repo
2. Click "Actions" tab
3. See latest workflow run

## ⚙️ Important Configuration

### Update Base Path (Required!)

In `vite.config.ts`, replace `ssa` with your repo name:

```typescript
base: process.env.GITHUB_ACTIONS ? '/YOUR_REPO_NAME/' : '/',
```

### Example:

- Repo: `https://github.com/john/my-app`
- Base: `/my-app/`

## 🐛 Quick Fixes

### Tests Fail in CI

```bash
npm ci                    # Clean install
npm run test              # Run tests locally
npm run lint:fix          # Fix lint issues
```

### Site Shows 404

- Check base path in `vite.config.ts`
- Wait 10 minutes after first deploy
- Check Settings → Pages is enabled

### Assets Not Loading

- Verify base path matches repo name
- Rebuild: `git commit --allow-empty -m "rebuild"`
- Push: `git push origin main`

## 📝 Commit Message Format

```bash
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
test: add tests
refactor: refactor code
```

## 🎯 That's It!

Every push to `main` = Automatic deployment to GitHub Pages ✨
