# 🚀 Vercel Deployment Guide

## Prerequisites
- ✅ Application working locally
- ✅ GitHub repository created
- ✅ All environment variables configured

## Step 1: Push to GitHub

```bash
# Make sure you've committed all changes
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from your project directory
vercel

# On first deploy, you'll be asked to:
# 1. Link to GitHub account
# 2. Select your repository
# 3. Configure project settings
```

### Option B: Using Vercel Dashboard

1. Go to **https://vercel.com**
2. Sign in (or create account)
3. Click **"Add New Project"**
4. Select your GitHub repository
5. Click **"Import"**
6. Configure environment variables (see below)
7. Click **"Deploy"**

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add ALL variables from your `.env` file:

```
PORT=3000
NODE_ENV=production
APP_URL=https://your-vercel-domain.vercel.app

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_STORAGE_BUCKET=encrypted-files

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# RSA Keys (from your .env)
RSA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Secure Cloud <noreply@securecloud.com>
```

## Step 4: Update CORS Configuration

The `APP_URL` in production will be your Vercel URL. Update it:

1. After Vercel deploys, note your domain (e.g., `secure-file-xyz.vercel.app`)
2. Go to Vercel Project Settings
3. Update the `APP_URL` environment variable
4. Trigger a redeployment

## Step 5: Important Supabase Configuration

### Allow Vercel Domain in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Go to **Settings** → **API**
3. Under **CORS configuration**, add your Vercel domain:
   ```
   https://your-domain.vercel.app
   https://*.vercel.app
   ```

### Create Storage Bucket (if not done)

1. Go to **Storage** in Supabase
2. Click **"Create a new bucket"**
3. Name: `encrypted-files`
4. Make it **PRIVATE** (not public)
5. Save

## Step 6: Test Your Deployment

```bash
# After deployment completes
curl https://your-domain.vercel.app/

# Test registration endpoint
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

## Troubleshooting

### ❌ "500 Internal Server Error"

- Check **Vercel logs**: Deployment tab → "Runtime logs"
- Verify all environment variables are set
- Make sure Supabase credentials are correct

### ❌ "Cannot POST /api/auth/register"

- Check that `server.js` is correctly exported
- Verify `vercel.json` routes are configured
- Check Vercel function logs

### ❌ "CORS Error"

- Add your Vercel domain to Supabase CORS settings
- Update `APP_URL` environment variable in Vercel

### ❌ "File upload not working"

- Verify `SUPABASE_STORAGE_BUCKET` is set correctly
- Check Supabase Storage bucket exists and is private
- Ensure `SUPABASE_SERVICE_ROLE_KEY` has storage permissions

## Monitoring

After deployment:

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** to see recent builds
3. Click **"Logs"** to see runtime errors
4. Check **Analytics** for traffic patterns

## Re-deployment

After making changes:

```bash
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically redeploys on git push
# Or manually trigger in Vercel dashboard
```

## Production Checklist

- ✅ All environment variables configured
- ✅ Database schema created in Supabase
- ✅ Storage bucket created and private
- ✅ Supabase CORS settings updated
- ✅ Email credentials working
- ✅ RSA keys configured
- ✅ HTTPS enforced (automatic with Vercel)
- ✅ Rate limiting enabled (optional)
- ✅ Error logging set up
- ✅ Monitoring enabled

## Support

For issues, check:
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Express.js Docs**: https://expressjs.com

---

**Your deployment is ready!** 🎉
