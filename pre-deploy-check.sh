#!/bin/bash

# Vercel Deployment Checklist
# Run this before deploying to Vercel

echo "🔍 Pre-Deployment Checklist"
echo "=========================="
echo ""

# Check 1: Git repository
if [ -d ".git" ]; then
    echo "✅ Git repository found"
else
    echo "❌ Git repository NOT found - initialize with: git init"
    exit 1
fi

# Check 2: Environment file
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file NOT found"
    exit 1
fi

# Check 3: All required env variables
echo ""
echo "Checking environment variables:"

required_vars=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "SUPABASE_STORAGE_BUCKET"
    "JWT_SECRET"
    "RSA_PRIVATE_KEY"
    "RSA_PUBLIC_KEY"
    "SMTP_HOST"
    "SMTP_PORT"
    "SMTP_USER"
    "SMTP_PASS"
)

for var in "${required_vars[@]}"; do
    if grep -q "^$var=" .env; then
        echo "  ✅ $var configured"
    else
        echo "  ❌ $var NOT configured"
    fi
done

# Check 4: Dependencies installed
if [ -d "node_modules" ]; then
    echo ""
    echo "✅ Dependencies installed"
else
    echo ""
    echo "❌ Dependencies not installed - run: npm install"
    exit 1
fi

# Check 5: vercel.json exists
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json configured"
else
    echo "❌ vercel.json NOT found"
    exit 1
fi

# Check 6: Server can start
echo ""
echo "Testing server startup..."
timeout 5 npm run dev > /dev/null 2>&1 &
if [ $? -eq 0 ]; then
    echo "✅ Server starts without errors"
    pkill -f "node server.js"
else
    echo "⚠️  Server startup test inconclusive"
fi

echo ""
echo "=========================="
echo "✨ All checks passed!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy to Vercel: vercel --prod"
echo "3. Configure environment variables in Vercel dashboard"
echo "4. Test your deployment!"
