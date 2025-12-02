🔑 **IMPORTANT: Get Your Service Role Key**

Your `.env` file has been updated with:
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY  
✅ SUPABASE_STORAGE_BUCKET (changed to "encrypted-files")

**You still need the SERVICE_ROLE_KEY:**

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/ywpvfsvshwzlfqcsxxfk
2. Click **Settings** (gear icon) → **API**
3. Scroll down to "Project API keys"
4. Find **service_role** key
5. Click **"Reveal"** button
6. Copy the long key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

Then update line 9 in your `.env` file:
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3cHZmc3ZzaHd6bGZxY3N4eGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4OTEyMzQ1NiwiZXhwIjoyMDA0Njk5NDU2fQ.YOUR_ACTUAL_KEY_HERE
```

⚠️ **Keep this key secret!** It has admin access to your database.
