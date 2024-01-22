import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Set your Supabase project URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY; // Set your Supabase public API key

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and API key are required.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
