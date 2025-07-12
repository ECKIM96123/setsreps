import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const generateWorkoutProgram = async (preferences: any) => {
  const { data, error } = await supabase.functions.invoke('generate-workout', {
    body: preferences,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export { supabase };