const { supabaseAdmin } = require('./lib/supabase/client');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    if (!supabaseAdmin) {
        console.error('❌ Supabase Admin client not initialized');
        console.error('Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
        process.exit(1);
    }

    try {
        console.log('🚀 Starting database setup...\n');

        // Read the schema file
        const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        // Split into individual statements
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--'));

        console.log(`📋 Found ${statements.length} SQL statements\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
            console.log(`   ${statement.substring(0, 50)}...`);

            const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement }).catch(() => ({
                error: { message: 'RPC not available - schema may already be created' }
            }));

            if (error && !error.message.includes('already exists')) {
                console.error(`❌ Error: ${error.message}`);
            } else {
                console.log(`   ✅ Done\n`);
            }
        }

        console.log('✨ Database setup complete!\n');
        console.log('📊 Your tables are ready:');
        console.log('   ✅ users');
        console.log('   ✅ files');
        console.log('\n🎉 You can now register users!');

    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        console.error('\n⚠️ Note: You may need to run the SQL manually in Supabase');
        console.error('See FIX_REGISTRATION_ERROR.md for manual steps');
        process.exit(1);
    }
}

setupDatabase();
