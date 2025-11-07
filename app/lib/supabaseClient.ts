import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'Supabase environment variables are not set. API features depending on Supabase will be disabled until you configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }
} else {
  cachedClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const getSupabaseClient = (): SupabaseClient => {
  if (!cachedClient) {
    throw new Error('Supabase is not configured. Please set the required environment variables.');
  }
  return cachedClient;
};
