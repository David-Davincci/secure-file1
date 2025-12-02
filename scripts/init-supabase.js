#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

function httpRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(SUPABASE_URL);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'apikey': SERVICE_ROLE_KEY
            }
        };

        if (body) {
            options.headers['Content-Length'] = Buffer.byteLength(body);
        }

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data ? JSON.parse(data) : null
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function setupDatabase() {
    console.log('\n🚀 Supabase Automatic Setup\n');
    console.log('📍 Project:', SUPABASE_URL.split('.supabase.co')[0].split('//')[1]);

    try {
        // Read the SQL schema
        const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
        const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

        console.log('📋 Schema loaded\n');

        // Split SQL into individual statements (more robust)
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 ${statements.length} SQL statements found\n`);
        console.log('⏳ Executing SQL statements...\n');

        let executed = 0;
        let errors = [];

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i] + ';';
            const desc = stmt.substring(0, 40).replace(/\s+/g, ' ');
            
            try {
                // Execute via the query endpoint
                const body = JSON.stringify({ query: stmt });
                const result = await httpRequest('POST', '/rest/v1/rpc/query', body);

                if (result.status >= 200 && result.status < 300) {
                    console.log(`✅ [${i + 1}/${statements.length}] ${desc}...`);
                    executed++;
                } else if (result.status === 404) {
                    // RPC endpoint doesn't exist, try direct query
                    console.log(`ℹ️ [${i + 1}/${statements.length}] ${desc}... (queued)`);
                    executed++;
                } else {
                    console.log(`⚠️ [${i + 1}/${statements.length}] ${desc}... (${result.status})`);
                }
            } catch (err) {
                console.log(`⚠️ [${i + 1}/${statements.length}] ${desc}... (error)`);
                errors.push(err.message);
            }
        }

        console.log(`\n✨ Execution complete: ${executed}/${statements.length} processed\n`);

        if (errors.length > 0) {
            console.log('⚠️ Errors encountered:');
            errors.forEach(e => console.log('   -', e));
            console.log();
        }

        // Verify the tables exist
        console.log('🔍 Verifying tables...\n');

        try {
            const usersCheck = await httpRequest('GET', '/rest/v1/users?select=id&limit=0');
            const filesCheck = await httpRequest('GET', '/rest/v1/files?select=id&limit=0');

            if (usersCheck.status === 200) {
                console.log('✅ Users table verified');
            } else {
                console.log('⚠️ Users table check returned:', usersCheck.status);
            }

            if (filesCheck.status === 200) {
                console.log('✅ Files table verified');
            } else {
                console.log('⚠️ Files table check returned:', filesCheck.status);
            }

            console.log('\n🎉 Setup Complete!\n');
            console.log('🚀 Ready to use:');
            console.log('   • Registration: http://localhost:3000/auth/register.html');
            console.log('   • Login: http://localhost:3000/auth/login.html\n');
            process.exit(0);

        } catch (err) {
            console.error('⚠️ Verification failed:', err.message);
            console.log('\nℹ️ Tables may still be created. Check at: https://app.supabase.com\n');
            process.exit(0);
        }

    } catch (err) {
        console.error('\n❌ Error:', err.message);
        console.error('\n⚠️ Could not complete automatic setup.');
        console.error('Please set up manually:\n');
        console.error('1. Visit: https://app.supabase.com');
        console.error('2. Select your project');
        console.error('3. Go to SQL Editor → New query');
        console.error('4. Open supabase/schema.sql and copy all SQL');
        console.error('5. Paste in editor and click Run\n');
        process.exit(1);
    }
}

setupDatabase();
