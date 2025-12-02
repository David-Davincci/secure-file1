## ⚠️ REGISTRATION ERROR - Database Schema Not Set Up

### 🔴 Problem
Your application is getting a 500 error during registration because the Supabase database tables haven't been created yet.

```
Error: Could not find the 'is_verified' column of 'users' in the schema cache
```

### ✅ Solution: Set Up Your Database

Follow these **exact steps** to create your database tables:

---

## Step-by-Step Guide

### 1️⃣ Open Supabase Dashboard
- Go to: https://app.supabase.com
- Log in with your account
- Select your project: **`secure-cloud`** (or whatever you named it)

### 2️⃣ Navigate to SQL Editor
- In the left sidebar, click **"SQL Editor"**
- Click **"New query"** button

### 3️⃣ Copy the Schema SQL
- Open this file in VS Code: `supabase/schema.sql`
- Select **ALL** the SQL code (Ctrl+A)
- Copy it (Ctrl+C)

### 4️⃣ Run the SQL
- Paste the SQL into the Supabase editor (Ctrl+V)
- Click the **"Run"** button (or press Ctrl+Enter)
- Wait for it to complete

You should see a green checkmark and the message: **"Success. No rows returned"**

### 5️⃣ Verify Tables Were Created
- Go to **"Table editor"** in the sidebar
- You should now see two tables:
  - ✅ `users` table
  - ✅ `files` table

If you see them, **you're done!** ✨

---

## 🧪 Test the Fix

After setting up the database:

1. **Stop the server** (press Ctrl+C in the terminal)
2. **Restart it**: `npm run dev`
3. **Try registering again** at http://localhost:3000/auth/register.html

---

## ❓ Troubleshooting

### Tables didn't get created?
- Check the error message in Supabase
- Make sure you're using the **SQL Editor**, not Data Editor
- Try running the SQL line by line to find the issue

### Still getting errors after creating tables?
- Make sure your `.env` file has the correct Supabase credentials
- Run this test: `node test-supabase-connection.js`
- Restart the server: `npm run dev`

---

## 📋 What the SQL Creates

The schema sets up:
- **users** table with: id, email, password_hash, is_verified, verification_token, reset_token, reset_token_expires, created_at
- **files** table with: id, user_id, file_name, mime_type, size, storage_path, encrypted_aes_key, created_at
- Indexes for better performance

This is required for the registration, login, and file storage to work.
