const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Warning: Supabase URL or Anon Key is missing in environment variables.');
    console.warn('ℹ️ Please configure these in your Vercel environment settings:');
    console.warn('   - SUPABASE_URL');
    console.warn('   - SUPABASE_ANON_KEY');
    console.warn('   - SUPABASE_SERVICE_ROLE_KEY');
}

// Standard client (for operations that might rely on RLS, though we mostly use admin for this backend-heavy app)
let supabase = null;
try {
    supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
} catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
}

// Admin client (bypasses RLS) - Use this for backend operations where we handle auth manually
let supabaseAdmin = null;
try {
    supabaseAdmin = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;
} catch (err) {
    console.error('❌ Failed to initialize Supabase admin client:', err.message);
}

module.exports = {
    supabase,
    supabaseAdmin
};
