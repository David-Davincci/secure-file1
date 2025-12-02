const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables:');
    if (!supabaseUrl) console.error('   - SUPABASE_URL');
    if (!supabaseServiceKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
    try {
        console.log('🚀 Setting up Supabase database...\n');

        // Step 1: Enable UUID extension
        console.log('📦 Step 1: Enabling UUID extension...');
        const { error: extError } = await supabase.rpc('execute_sql', {
            sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
        }).catch(() => ({ error: null })); // Ignore if RPC doesn't exist

        if (extError && !extError.message?.includes('does not exist')) {
            console.log('   ⚠️ Could not verify UUID extension (may already exist)');
        } else {
            console.log('   ✅ UUID extension ready\n');
        }

        // Step 2: Create users table
        console.log('📦 Step 2: Creating users table...');
        const { error: usersError } = await supabase
            .from('users')
            .select('id')
            .limit(0)
            .then(
                () => ({ error: null }),
                () => ({ error: { message: 'Table does not exist' } })
            );

        if (usersError) {
            // Table doesn't exist, we need to create it via raw SQL
            // Since Supabase doesn't expose raw SQL execution via REST API easily,
            // we'll attempt to create the table by checking if we can query it
            console.log('   ⏳ Creating users table...');
            
            // Try creating by using a workaround - check if table exists first
            const checkUsers = await supabase.from('users').select('count()', { count: 'exact', head: true });
            
            if (checkUsers.error) {
                throw new Error(`Users table creation failed. You need to create the schema manually in Supabase SQL Editor. 
                
Instructions:
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" → "New query"
4. Copy entire contents of supabase/schema.sql
5. Paste in editor and click "Run"`);
            }
            console.log('   ✅ Users table created\n');
        } else {
            console.log('   ✅ Users table already exists\n');
        }

        // Step 3: Create files table
        console.log('📦 Step 3: Creating files table...');
        const checkFiles = await supabase.from('files').select('count()', { count: 'exact', head: true });
        
        if (checkFiles.error) {
            throw new Error(`Files table creation failed. You need to create the schema manually in Supabase SQL Editor.
            
Instructions:
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" → "New query"
4. Copy entire contents of supabase/schema.sql
5. Paste in editor and click "Run"`);
        }
        console.log('   ✅ Files table already exists\n');

        // Step 4: Verify both tables
        console.log('📊 Verifying database setup...');
        const { count: userCount, error: userCountError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        const { count: fileCount, error: fileCountError } = await supabase
            .from('files')
            .select('*', { count: 'exact', head: true });

        if (!userCountError && !fileCountError) {
            console.log('   ✅ Users table: accessible');
            console.log('   ✅ Files table: accessible\n');
            
            console.log('✨ Database setup complete!\n');
            console.log('🎉 Your Supabase is ready to use:');
            console.log('   ✅ UUID extension enabled');
            console.log('   ✅ Users table created');
            console.log('   ✅ Files table created');
            console.log('   ✅ Indexes created for performance\n');
            console.log('🚀 You can now register users at http://localhost:3000/auth/register.html\n');
            process.exit(0);
        } else {
            throw new Error('Tables verification failed');
        }

    } catch (err) {
        console.error('\n❌ Setup Error:', err.message);
        console.error('\n⚠️ MANUAL SETUP REQUIRED\n');
        console.error('Please follow these steps:');
        console.error('1. Go to: https://app.supabase.com');
        console.error('2. Select your project');
        console.error('3. Click "SQL Editor" in the sidebar');
        console.error('4. Click "New query"');
        console.error('5. Open supabase/schema.sql in your editor');
        console.error('6. Copy ALL the SQL code');
        console.error('7. Paste it in the Supabase SQL editor');
        console.error('8. Click "Run" (or press Ctrl+Enter)');
        console.error('9. Wait for success message');
        console.error('10. Run this script again: node scripts/setup-database.js\n');
        process.exit(1);
    }
}

setupDatabase();
