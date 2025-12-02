# Secure Cloud - Backend Setup Guide

Follow these steps to configure your Supabase database and email service.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `secure-cloud` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** (takes ~2 minutes)

## Step 2: Get Supabase Credentials

Once your project is created:

1. Go to **Settings** (gear icon in sidebar) → **API**
2. Copy these values:
   - **Project URL** → This is your `SUPABASE_URL`
   - **anon public** key → This is your `SUPABASE_ANON_KEY`
   - **service_role** key (click "Reveal" button) → This is your `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Keep the service_role key secret!**

## Step 3: Set Up Database Schema

1. In Supabase dashboard, click **SQL Editor** (in sidebar)
2. Click **"New Query"**
3. Open the file `supabase/schema.sql` in your project
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

This creates:
- `users` table (for authentication)
- `files` table (for file metadata)

## Step 4: Create Storage Bucket

1. In Supabase dashboard, click **Storage** (in sidebar)
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `secure-files` (must match `.env` file)
   - **Public bucket**: **OFF** (keep it private!)
4. Click **"Create bucket"**

## Step 5: Configure Gmail SMTP (for emails)

### Option A: Gmail with App Password (Recommended)

1. Go to your Google Account: [myaccount.google.com](https://myaccount.google.com)
2. Enable **2-Step Verification** (Security → 2-Step Verification)
3. Go to **App Passwords**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Create a new app password:
   - **App**: Select "Mail"
   - **Device**: Select "Other" and type "Secure Cloud"
5. Click **"Generate"**
6. Copy the 16-character password (no spaces)

### Option B: Alternative Email Services

If you prefer not to use Gmail:
- **Resend**: [resend.com](https://resend.com) (free tier: 100 emails/day)
- **SendGrid**: [sendgrid.com](https://sendgrid.com) (free tier: 100 emails/day)
- **Brevo** (formerly Sendinblue): [brevo.com](https://brevo.com) (free tier: 300 emails/day)

## Step 6: Update Your .env File

Open `c:\Users\User\Desktop\projects\secure-file\.env` and update these lines:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_STORAGE_BUCKET=secure-files

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=Secure Cloud <your-actual-email@gmail.com>
```

**Optional**: Change the JWT secret for better security:
```env
JWT_SECRET=your-super-secret-random-string-here-make-it-long
```

## Step 7: Restart the Server

After updating `.env`:

1. Stop the current server (Ctrl+C in terminal)
2. Restart: `npm run dev`
3. The server should start without errors

## Step 8: Test the Application

1. Go to `http://localhost:3000`
2. Click **"Get Started"** or **"Register"**
3. Create a test account with your email
4. Check your email for the verification link
5. Click the link to verify
6. Login and try uploading a file!

## Troubleshooting

### "Supabase client error"
- Double-check your `SUPABASE_URL` and keys in `.env`
- Make sure there are no extra spaces or quotes

### "Email not sending"
- Verify your Gmail App Password is correct (16 characters, no spaces)
- Make sure 2-Step Verification is enabled on your Google account
- Check the server logs for specific email errors

### "Storage upload failed"
- Verify the bucket name is exactly `secure-files`
- Make sure the bucket is created in Supabase Storage
- Check that `SUPABASE_SERVICE_ROLE_KEY` is correct

---

Once configured, your Secure Cloud will be fully functional with:
✅ User registration & email verification
✅ Encrypted file uploads
✅ Secure file storage in Supabase
✅ File preview & download
