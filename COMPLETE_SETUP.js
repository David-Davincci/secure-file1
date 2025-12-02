#!/usr/bin/env node

/**
 * Complete Setup Instructions
 * Shows the SQL that needs to be run in Supabase
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '█'.repeat(70));
console.log('█  🚀 SUPABASE SETUP - COMPLETE MANUAL INSTRUCTIONS');
console.log('█'.repeat(70) + '\n');

console.log('⚠️  IMPORTANT: The database schema must be created manually in Supabase.\n');
console.log('This is a ONE-TIME setup. Follow the steps below:\n');

console.log('═'.repeat(70));
console.log('STEP 1️⃣ : GO TO SUPABASE DASHBOARD');
console.log('═'.repeat(70));
console.log(`
   Open: https://app.supabase.com

   1. Log in with your account
   2. Select your project (the one with URL in your .env)
   3. In the left sidebar, click "SQL Editor"
   4. Click the "New query" button
   
`);

console.log('═'.repeat(70));
console.log('STEP 2️⃣ : COPY THIS SQL CODE');
console.log('═'.repeat(70));
console.log();

const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
const sqlCode = fs.readFileSync(schemaPath, 'utf-8');

console.log('┌─ BEGIN SQL CODE ─────────────────────────────────────────────────┐');
console.log('│');
console.log(sqlCode.split('\n').map(line => '│ ' + line).join('\n'));
console.log('│');
console.log('└─ END SQL CODE ───────────────────────────────────────────────────┘\n');

console.log('═'.repeat(70));
console.log('STEP 3️⃣ : PASTE & RUN IN SUPABASE');
console.log('═'.repeat(70));
console.log(`
   1. Copy the SQL code above (select all and Ctrl+C)
   2. Go back to your Supabase SQL Editor browser tab
   3. Paste the SQL: Ctrl+V
   4. Click "Run" button OR press Ctrl+Enter
   5. Wait for the success message: "Success. No rows returned"

`);

console.log('═'.repeat(70));
console.log('STEP 4️⃣ : VERIFY TABLES WERE CREATED');
console.log('═'.repeat(70));
console.log(`
   1. In Supabase sidebar, click "Table editor"
   2. You should see these tables:
      ✅ users
      ✅ files
   3. If you see them, the setup is complete!

`);

console.log('═'.repeat(70));
console.log('STEP 5️⃣ : RESTART YOUR SERVER & TEST');
console.log('═'.repeat(70));
console.log(`
   1. Close and restart your dev server:
      • Press Ctrl+C in the terminal
      • Run: npm run dev
   
   2. Try registration:
      • Open: http://localhost:3000/auth/register.html
      • Create a test account
      • Check your email for verification link
      • Should work now! ✅

`);

console.log('═'.repeat(70));
console.log('❓ TROUBLESHOOTING');
console.log('═'.repeat(70));
console.log(`
• "Table does not exist" error:
  → Make sure the SQL was executed successfully
  → Check that you can see tables in "Table editor"

• "Column not found" error:
  → Re-run the SQL script - it creates all columns
  → May need to wait a moment for Supabase to cache the schema

• Still not working:
  → Check your .env file has correct Supabase credentials
  → Run: node test-supabase-connection.js
  → Check for any typos in credentials

`);

console.log('█'.repeat(70));
console.log('█  Once tables are created, registration will work! 🎉');
console.log('█'.repeat(70) + '\n');
