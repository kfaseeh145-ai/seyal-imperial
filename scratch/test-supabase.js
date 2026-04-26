const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hhicxrwwwuftzhmmlraj.supabase.co';
const supabaseAnonKey = 'sb_publishable_Skhe6ZbUmlU7WbEe8a470A_BEx-6oW6';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    if (error) {
        console.error('Connection Failed:', error.message);
        console.error('Details:', error);
    } else {
        console.log('Connection Successful! Found products:', data.length);
    }
}

test();
