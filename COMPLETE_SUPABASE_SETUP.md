# Complete Supabase Setup

Great! Your credentials are configured. Now complete these final steps:

## Step 1: Create Database Tables

1. **Go to your Supabase SQL Editor**:
   - Visit: https://supabase.com/dashboard/project/ywpvfsvshwzlfqcsxxfk/sql
   - Or click **SQL Editor** in the left sidebar

2. **Create a new query**:
   - Click **"New Query"** button

3. **Copy the SQL schema**:
   - Open: `c:\Users\User\Desktop\projects\secure-file\supabase\schema.sql`
   - Copy ALL the SQL code (or use the code below)

4. **Paste and run**:
   - Paste the SQL into the Supabase SQL Editor
   - Click **"Run"** (or press Ctrl+Enter)
   - You should see: ✅ "Success. No rows returned"

### SQL Schema to Run:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  encrypted_aes_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_token);
CREATE INDEX idx_files_user_id ON files(user_id);
```

## Step 2: Create Storage Bucket

1. **Go to Storage**:
   - Visit: https://supabase.com/dashboard/project/ywpvfsvshwzlfqcsxxfk/storage/buckets
   - Or click **Storage** in the left sidebar

2. **Create new bucket**:
   - Click **"Create a new bucket"** or **"New bucket"**

3. **Configure bucket**:
   - **Name**: `encrypted-files` (must match exactly!)
   - **Public bucket**: **OFF** / **Private** ✅
   - Click **"Create bucket"**

## Step 3: Restart Your Server

After completing the above steps:

1. **Stop the current server** (press Ctrl+C in your terminal)
2. **Restart**: `npm run dev`
3. **Server should start without errors**

## Step 4: Test the Application

1. Go to `http://localhost:3000`
2. Click **"Get Started"** to register
3. Create a test account
4. Try uploading a file!

---

**Note**: Email verification won't work yet (you need to configure SMTP), but you can manually verify users in the Supabase database if needed for testing.

Let me know once you've completed these steps!
