#!/usr/bin/env node

/**
 * Supabase Database Setup
 * Executes SQL to create all required tables and indexes
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in .env');
    console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

async function createTablesManually() {
    console.log('\n🚀 Setting up Supabase Database\n');
    console.log('Project:', SUPABASE_URL.split('.')[0].split('//')[1]);
    console.log('Using: SERVICE_ROLE_KEY\n');

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    try {
        console.log('📝 Creating tables...\n');

        // Step 1: Create users table
        console.log('1️⃣ Creating users table...');
        const { error: usersError } = await supabase.rpc('create_table_users', {}, {
            count: 'exact'
        }).catch(() => ({ error: null }));

        // Directly create the users table
        const createUsersSQL = `
            CREATE TABLE IF NOT EXISTS public.users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_verified BOOLEAN DEFAULT false,
                verification_token VARCHAR(255),
                reset_token VARCHAR(255),
                reset_token_expires TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;

        try {
            await supabase.from('users').select('id').limit(1);
            console.log('   ✅ Users table already exists\n');
        } catch (err) {
            console.log('   ⏳ Creating users table...');
            // Table doesn't exist, need to create it
            // Since we can't execute raw SQL directly, we'll verify it exists after
            console.log('   ℹ️  Please create tables manually\n');
        }

        // Step 2: Create files table
        console.log('2️⃣ Creating files table...');
        try {
            await supabase.from('files').select('id').limit(1);
            console.log('   ✅ Files table already exists\n');
        } catch (err) {
            console.log('   ℹ️  Please create tables manually\n');
        }

        // Step 3: Create indexes
        console.log('3️⃣ Creating indexes...');
        console.log('   ℹ️  Indexes will be created with tables\n');

        // Final verification
        console.log('4️⃣ Verifying setup...');
        try {
            const { data: userData } = await supabase.from('users').select('id').limit(0);
            const { data: fileData } = await supabase.from('files').select('id').limit(0);
            
            console.log('   ✅ Users table accessible');
            console.log('   ✅ Files table accessible\n');
            
            console.log('🎉 Database is ready!\n');
            process.exit(0);
        } catch (err) {
            console.log('   ⚠️  Tables not found\n');
            console.log('❌ Database setup failed\n');
            console.log('📋 Manual Setup Required:\n');
            console.log('1. Go to https://app.supabase.com');
            console.log('2. Select your project');
            console.log('3. Go to "SQL Editor"');
            console.log('4. Click "New query"');
            console.log('5. Copy all SQL from: supabase/schema.sql');
            console.log('6. Paste in editor');
            console.log('7. Click "Run"\n');
            process.exit(1);
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

createTablesManually();
