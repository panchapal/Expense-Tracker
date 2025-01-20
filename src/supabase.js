import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gftjcgkjenxxdnrdyvwe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdGpjZ2tqZW54eGRucmR5dndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMjA2OTAsImV4cCI6MjA1MjU5NjY5MH0.IT8KF-YGR0jdlUWRvgxzbc9kGtvaOYewg_WoGpc1q38";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
