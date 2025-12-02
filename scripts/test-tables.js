#!/usr/bin/env node

const https = require('https');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
                resolve({
                    status: res.statusCode,
                    raw: data
                });
            });
        });

        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function testTables() {
    console.log('\n📊 Testing table existence:\n');

    // Test users table - just try to count
    const usersReq = await httpRequest('GET', '/rest/v1/users?select=count()');
    console.log('Users table query:');
    console.log('  Status:', usersReq.status);
    console.log('  Response:', usersReq.raw.substring(0, 100));
    console.log();

    // Test files table
    const filesReq = await httpRequest('GET', '/rest/v1/files?select=count()');
    console.log('Files table query:');
    console.log('  Status:', filesReq.status);
    console.log('  Response:', filesReq.raw.substring(0, 100));
}

testTables();
