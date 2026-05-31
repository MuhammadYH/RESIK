const SUPABASE_URL = "https://vcxwphzxavolrbsafroa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHdwaHp4YXZvbHJic2Fmcm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzM4NjQsImV4cCI6MjA5NDg0OTg2NH0.OOW5l0QgcNRPp5Q4qBIaK6uotvTdo91zt2uV5ON6rx0";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Expose ke window agar dapat diakses oleh auth.js, session.js, role-check.js, dll.
window.supabaseClient = supabaseClient;
