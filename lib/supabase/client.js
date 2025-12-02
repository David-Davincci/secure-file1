const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase URL or Anon Key is missing in environment variables.');
}

// Standard client (for operations that might rely on RLS, though we mostly use admin for this backend-heavy app)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (bypasses RLS) - Use this for backend operations where we handle auth manually
const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

module.exports = {
    supabase,
    supabaseAdmin
};
