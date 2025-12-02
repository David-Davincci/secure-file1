# 🚀 Deployment to Vercel - Quick Start

Your **Secure File** application is ready to deploy to Vercel! Here's everything you need to know:

## ✅ What's Been Done

- ✅ Application fully tested locally
- ✅ Database schema created in Supabase
- ✅ Environment variables configured
- ✅ Vercel configuration files set up (`vercel.json`, `.vercelignore`)
- ✅ Server optimized for serverless deployment
- ✅ File uploads and downloads working
- ✅ Email verification functional
- ✅ Authentication working

## 📋 Deployment Steps

### **Step 1: Prepare Your Code**

```bash
# Make sure you're in the project directory
cd c:\Users\User\Desktop\projects\secure-file

# Commit your changes
git add .
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

### **Step 2: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 3: Deploy to Vercel**

```bash
# From your project directory
vercel --prod
```

On first run, Vercel will:
1. Ask you to authenticate with GitHub
2. Link to your GitHub repository
3. Ask for confirmation to deploy

### **Step 4: Configure Environment Variables in Vercel**

After deployment, go to your **Vercel Dashboard**:

1. Click on your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_STORAGE_BUCKET=encrypted-files
JWT_SECRET=your-jwt-secret-from-.env
JWT_EXPIRES_IN=24h
RSA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Secure Cloud <noreply@securecloud.com>
NODE_ENV=production
```

### **Step 5: Update Supabase CORS Settings**

1. Go to **Supabase Dashboard**
2. Click **Settings** → **API**
3. Add your Vercel URL to CORS allowed origins:
   ```
   https://your-domain.vercel.app
   https://*.vercel.app
   ```

### **Step 6: Verify Deployment**

After environment variables are set, trigger a redeploy:

1. In Vercel, go to **Deployments**
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit: `git push origin main`

## 🧪 Testing Your Deployment

Once deployed, test these endpoints:

```bash
# Get your Vercel URL from the dashboard (e.g., https://secure-file-xyz.vercel.app)

# Test server is running
curl https://your-vercel-domain.vercel.app/

# Test registration
curl -X POST https://your-vercel-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Visit the app in your browser
https://your-vercel-domain.vercel.app/
```

## 🔑 Getting Your Environment Variables

If you need to copy values from your `.env` file:

**From your .env file:**
```
SUPABASE_URL=https://ywpvfsvshwzlfqcsxxfk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_STORAGE_BUCKET=encrypted-files
JWT_SECRET=7f8a9b2c4d5e6f1a3b7c9d2e4f6a8b1c...
RSA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Copy these exact values to Vercel environment variables.**

## ⚠️ Important Notes

1. **Don't commit `.env`** - It's already in `.gitignore`
2. **RSA Keys** - These must be kept SECRET. Only store in:
   - `.env` (local, never committed)
   - Vercel environment variables (encrypted)
3. **SMTP Password** - This is your Gmail App Password, keep it secret
4. **Service Role Key** - This is sensitive, treat like a password

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "500 Internal Server Error" | Check Vercel logs: go to Deployment → Runtime logs |
| "CORS Error" | Add your Vercel URL to Supabase CORS settings |
| "Cannot find module" | Run `npm install` locally first, then push to git |
| "Database connection error" | Verify Supabase credentials in Vercel env vars |
| "Email not sending" | Verify SMTP credentials and Gmail 2FA app password |

## 📚 Quick Reference

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Your Project**: Will be at `https://your-project.vercel.app`

## 🎉 You're Ready!

Your application is production-ready. Follow the deployment steps above and your Secure File app will be live on the internet!

---

**Questions?** Check out:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
