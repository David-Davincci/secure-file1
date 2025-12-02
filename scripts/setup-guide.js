#!/usr/bin/env node

/**
 * Supabase Setup - Web Interface Guide
 * Since Supabase doesn't expose SQL execution via API, tables must be created via web UI
 */

const open = require('open');
const fs = require('fs');
const path = require('path');

async function launchSetupGuide() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 SECURE FILE - DATABASE SETUP GUIDE');
    console.log('='.repeat(60) + '\n');

    console.log('⚠️  Supabase tables must be created through the web dashboard.\n');

    console.log('📋 FOLLOW THESE STEPS:\n');

    console.log('STEP 1: Open Supabase Dashboard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   • Go to: https://app.supabase.com');
    console.log('   • Log in');
    console.log('   • Select your project\n');

    console.log('STEP 2: Open SQL Editor');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   • Click "SQL Editor" in the left sidebar');
    console.log('   • Click "New query" button\n');

    console.log('STEP 3: Copy Schema SQL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    console.log('📄 Opening: supabase/schema.sql\n');
    console.log('   • Select ALL the SQL code (Ctrl+A)\n');
    console.log('   HERE IS THE SQL TO RUN:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(schema);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('STEP 4: Paste & Execute in Supabase');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   • Paste the SQL into the Supabase editor (Ctrl+V)');
    console.log('   • Click "Run" button (or press Ctrl+Enter)');
    console.log('   • Wait for completion\n');

    console.log('STEP 5: Verify Tables Were Created');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   • Go to "Table editor" in Supabase sidebar');
    console.log('   • You should see:');
    console.log('     ✅ users table');
    console.log('     ✅ files table\n');

    console.log('🎯 NEXT STEPS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Complete the SQL setup above');
    console.log('2. Restart your server: npm run dev');
    console.log('3. Try registration: http://localhost:3000/auth/register.html\n');

    console.log('═'.repeat(60) + '\n');

    // Try to open dashboard
    try {
        console.log('💡 Opening Supabase dashboard in your browser...\n');
        await open('https://app.supabase.com');
    } catch (err) {
        console.log('   ℹ️  Could not open browser automatically');
    }
}

launchSetupGuide();
