const supabaseUrl = 'https://vcxwphzxavolrbsafroa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjedwaHp4YXZvbHJic2Fmcm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzM4NjQsImV4cCI6MA5NDg0OTg2NH0.OOW5l0QgcNRPp5Q4qBIaK6uotvTdo91zt2uV5ON6rx0'

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
)