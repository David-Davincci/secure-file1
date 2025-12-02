const { supabaseAdmin } = require('../lib/supabase/client');

async function testConnection() {
    console.log('🧪 Testing Supabase connection...\n');

    try {
        // Test 1: Check users table
        console.log('1️⃣  Testing users table...');
        const { data: users, error: usersError } = await supabaseAdmin
            .from('users')
            .select('count')
            .limit(1);

        if (usersError) {
            console.log('   ❌ Users table error:', usersError.message);
        } else {
            console.log('   ✅ Users table accessible');
        }

        // Test 2: Check files table
        console.log('2️⃣  Testing files table...');
        const { data: files, error: filesError } = await supabaseAdmin
            .from('files')
            .select('count')
            .limit(1);

        if (filesError) {
            console.log('   ❌ Files table error:', filesError.message);
        } else {
            console.log('   ✅ Files table accessible');
        }

        // Test 3: Check storage bucket
        console.log('3️⃣  Testing storage bucket...');
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'encrypted-files';
        const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();

        if (bucketError) {
            console.log('   ❌ Storage error:', bucketError.message);
        } else {
            const bucket = buckets.find(b => b.name === bucketName);
            if (bucket) {
                console.log(`   ✅ Storage bucket "${bucketName}" exists`);
            } else {
                console.log(`   ❌ Storage bucket "${bucketName}" not found`);
            }
        }

        console.log('\n🎉 Connection test complete!\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testConnection();
