const { supabaseAdmin } = require('./lib/supabase/client');

async function testConnection() {
    try {
        console.log('🧪 Testing Supabase connection...\n');
        
        // Try to query users table
        console.log('📋 Attempting to query users table...');
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('count()', { count: 'exact', head: true })
            .limit(1);
        
        if (error) {
            console.error('❌ Error querying users table:', error.message);
            console.error('\n⚠️ The database schema needs to be set up!');
            console.log('\n📝 Steps to fix:');
            console.log('1. Go to https://app.supabase.com');
            console.log('2. Select your project');
            console.log('3. Go to SQL Editor');
            console.log('4. Create a new query');
            console.log('5. Copy the SQL from: supabase/schema.sql');
            console.log('6. Paste it in the editor and click "Run"');
            return;
        }
        
        console.log('✅ Supabase connection successful!');
        console.log('📊 Users table exists and is accessible');
        
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

testConnection();
