#!/usr/bin/env node

const https = require('https');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing credentials');
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
                        body: data ? JSON.parse(data) : null,
                        raw: data
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        body: null,
                        raw: data
                    });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function checkSchema() {
    console.log('\n🔍 Checking Supabase Schema\n');

    try {
        // Check information_schema to see actual tables
        const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`;
        
        const body = JSON.stringify({ query });
        const result = await httpRequest('POST', '/rest/v1/rpc/query', body);

        console.log('Status:', result.status);
        console.log('Response:', result.raw);
        console.log();

        // Try direct table queries
        console.log('📊 Checking table access:\n');

        const usersResult = await httpRequest('GET', '/rest/v1/users?select=id&head=true&limit=0');
        console.log('Users table:', usersResult.status === 200 ? '✅ Exists' : `❌ Error ${usersResult.status}`);
        if (usersResult.status !== 200) {
            console.log('  Response:', usersResult.raw);
        }

        const filesResult = await httpRequest('GET', '/rest/v1/files?select=id&head=true&limit=0');
        console.log('Files table:', filesResult.status === 200 ? '✅ Exists' : `❌ Error ${filesResult.status}`);
        if (filesResult.status !== 200) {
            console.log('  Response:', filesResult.raw);
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkSchema();
