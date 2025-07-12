import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

// Only create Supabase client if environment variables are available
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export const generateWorkoutProgram = async (preferences: any) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Please set up your Supabase environment variables.');
  }

  const { data, error } = await supabase.functions.invoke('generate-workout', {
    body: preferences,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export { supabase };