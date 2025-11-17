#!/bin/bash

# Pre-deployment Check Script
# This script verifies that your project is ready for GitHub deployment

echo "🔍 Running Pre-Deployment Checks..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if all checks pass
ALL_PASSED=true

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ALL_PASSED=false
    fi
}

# Check 1: Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    print_status 0 "Node.js version is $NODE_VERSION (>= 18 required)"
else
    print_status 1 "Node.js version is $NODE_VERSION (>= 18 required)"
fi
echo ""

# Check 2: Dependencies installed
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    print_status 0 "Dependencies are installed"
else
    print_status 1 "Dependencies not installed. Run: npm install"
fi
echo ""

# Check 3: Lint
echo "🔍 Running ESLint..."
npm run lint > /dev/null 2>&1
print_status $? "ESLint check"
echo ""

# Check 4: TypeScript
echo "📘 Running TypeScript check..."
npx tsc --noEmit > /dev/null 2>&1
print_status $? "TypeScript check"
echo ""

# Check 5: Unit Tests
echo "🧪 Running unit tests..."
npm run test > /dev/null 2>&1
print_status $? "Unit tests"
echo ""

# Check 6: Build
echo "🏗️  Testing production build..."
npm run build > /dev/null 2>&1
print_status $? "Production build"
echo ""

# Check 7: Git status
echo "📝 Checking Git status..."
if [ -d ".git" ]; then
    print_status 0 "Git repository initialized"
    
    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        print_status 0 "No uncommitted changes"
    else
        echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    fi
else
    print_status 1 "Git repository not initialized. Run: git init"
fi
echo ""

# Check 8: GitHub remote
echo "🌐 Checking GitHub remote..."
if git remote -v | grep -q "github.com"; then
    REMOTE_URL=$(git remote get-url origin)
    print_status 0 "GitHub remote configured: $REMOTE_URL"
else
    print_status 1 "GitHub remote not configured. Run: git remote add origin <url>"
fi
echo ""

# Check 9: Base path configuration
echo "⚙️  Checking vite.config.ts base path..."
if grep -q "base: process.env.GITHUB_ACTIONS" vite.config.ts; then
    print_status 0 "Base path is configured for GitHub Pages"
    
    # Extract repo name from base path
    BASE_PATH=$(grep "base: process.env.GITHUB_ACTIONS" vite.config.ts | grep -o "'/[^']*'" | tr -d "'")
    echo -e "${YELLOW}   Current base path: $BASE_PATH${NC}"
    echo -e "${YELLOW}   Make sure this matches your repository name!${NC}"
else
    print_status 1 "Base path not configured in vite.config.ts"
fi
echo ""

# Check 10: Environment files
echo "🔐 Checking environment files..."
if [ -f ".env.example" ]; then
    print_status 0 ".env.example exists"
else
    print_status 1 ".env.example not found"
fi

if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local exists (make sure it's in .gitignore)${NC}"
fi
echo ""

# Check 11: GitHub Actions workflow
echo "🔄 Checking GitHub Actions workflow..."
if [ -f ".github/workflows/ci-cd.yml" ]; then
    print_status 0 "CI/CD workflow file exists"
else
    print_status 1 "CI/CD workflow file not found"
fi
echo ""

# Final summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✨ All checks passed! You're ready to deploy!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Initial commit'"
    echo "3. git push origin main"
    echo "4. Enable GitHub Pages in repository settings"
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
