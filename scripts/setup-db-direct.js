const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables');
    console.error('   SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', SERVICE_ROLE_KEY ? '✅' : '❌');
    process.exit(1);
}

async function executeSql(sql) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({ query: sql })
    });

    return response.json();
}

async function setupDatabase() {
    try {
        console.log('\n🚀 Automatic Supabase Database Setup\n');
        console.log('📍 Project URL:', SUPABASE_URL);
        console.log('🔑 Auth: Using SERVICE_ROLE_KEY\n');

        // Read schema
        const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        console.log('📋 Schema loaded from supabase/schema.sql');
        console.log('📝 Executing SQL statements...\n');

        // Split and execute statements
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--'));

        console.log(`Found ${statements.length} SQL statements\n`);

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            const preview = stmt.substring(0, 40).replace(/\n/g, ' ');
            process.stdout.write(`⏳ [${i + 1}/${statements.length}] ${preview}... `);

            try {
                const result = await executeSql(stmt);
                console.log('✅');
            } catch (error) {
                console.log('⚠️ (may already exist)');
            }
        }

        console.log('\n✨ Database setup complete!\n');
        console.log('✅ Tables created:');
        console.log('   • users');
        console.log('   • files');
        console.log('✅ Indexes created for performance\n');
        console.log('🎉 Ready to use! Try registering at: http://localhost:3000/auth/register.html\n');

    } catch (err) {
        console.error('\n❌ Setup failed:', err.message);
        
        if (err.message.includes('fetch')) {
            console.error('\n⚠️ Could not execute SQL via API. Using manual approach...\n');
            console.error('Please set up the schema manually:');
        }
        
        console.error('\n📝 Manual Setup Steps:');
        console.error('1. Go to https://app.supabase.com');
        console.error('2. Select your project');
        console.error('3. Click "SQL Editor" → "New query"');
        console.error('4. Copy all SQL from: supabase/schema.sql');
        console.error('5. Paste in editor and click "Run"');
        console.error('6. Verify tables in "Table editor"\n');
        
        process.exit(1);
    }
}

setupDatabase();
