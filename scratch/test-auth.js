require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hhicxrwwwuftzhmmlraj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Skhe6ZbUmlU7WbEe8a470A_BEx-6oW6';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
    console.log('Testing Supabase Auth signUp...');
    const randomEmail = `test_${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.signUp({
        email: randomEmail,
        password: 'password123',
        options: {
            data: {
                name: 'Test User',
                role: 'user'
            }
        }
    });

    if (error) {
        console.error('Sign Up Failed:', error.message);
        console.error('Full error:', error);
    } else {
        console.log('Sign Up Successful! Data:', data);
    }
}

testAuth();
