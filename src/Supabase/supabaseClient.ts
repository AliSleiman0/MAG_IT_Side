import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fbzizacbqkmfobmzospk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZieml6YWNicWttZm9ibXpvc3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNTM4OTEsImV4cCI6MjA1NDYyOTg5MX0.56C9tL7mi8GFv-2M0BV76327HATmzDSef9bKcC0FCqk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
