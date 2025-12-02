const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
    console.log('🚀 Starting Supabase setup...\n');

    try {
        // Read the SQL schema file
        const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('📄 Running SQL schema...');

        // Split the schema into individual statements
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        // Execute each statement
        for (const statement of statements) {
            if (statement.trim()) {
                const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

                // If rpc doesn't work, try direct query
                if (error && error.message.includes('exec_sql')) {
                    // Fallback: we'll need to use the REST API or direct connection
                    console.log('⚠️  Note: Direct SQL execution requires manual setup in Supabase dashboard');
                    console.log('   Please run the SQL in supabase/schema.sql manually');
                    break;
                } else if (error) {
                    // Check if it's just "already exists" errors which are fine
                    if (error.message.includes('already exists')) {
                        console.log('ℹ️  Table/extension already exists, skipping...');
                    } else {
                        throw error;
                    }
                }
            }
        }

        console.log('✅ Database schema setup complete!\n');

        // Check if tables exist
        console.log('🔍 Verifying tables...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        const { data: files, error: filesError } = await supabase
            .from('files')
            .select('count')
            .limit(1);

        if (!usersError && !filesError) {
            console.log('✅ Tables verified: users ✓, files ✓\n');
        } else {
            console.log('⚠️  Tables may not exist yet. Please run the SQL manually in Supabase dashboard.\n');
        }

        // Check/create storage bucket
        console.log('🗂️  Checking storage bucket...');
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'encrypted-files';

        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === bucketName);

        if (bucketExists) {
            console.log(`✅ Storage bucket "${bucketName}" already exists!\n`);
        } else {
            console.log(`📦 Creating storage bucket "${bucketName}"...`);
            const { data, error } = await supabase.storage.createBucket(bucketName, {
                public: false,
                fileSizeLimit: 52428800 // 50MB
            });

            if (error) {
                if (error.message.includes('already exists')) {
                    console.log(`✅ Storage bucket "${bucketName}" already exists!\n`);
                } else {
                    console.error('❌ Error creating bucket:', error.message);
                    console.log('   Please create the bucket manually in Supabase dashboard\n');
                }
            } else {
                console.log(`✅ Storage bucket "${bucketName}" created successfully!\n`);
            }
        }

        console.log('🎉 Supabase setup complete!\n');
        console.log('Next steps:');
        console.log('1. Restart your server: npm run dev');
        console.log('2. Visit http://localhost:3000');
        console.log('3. Register and test file upload!\n');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n📋 Manual setup required:');
        console.log('1. Go to Supabase SQL Editor');
        console.log('2. Run the SQL in supabase/schema.sql');
        console.log('3. Go to Storage and create bucket: encrypted-files (private)\n');
        process.exit(1);
    }
}

setupDatabase();
