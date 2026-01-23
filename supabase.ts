import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aoledrespkplfrfhxajy.supabase.co'
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbGVkcmVzcGtwbGZyZmh4YWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzE5MDcsImV4cCI6MjA4NDcwNzkwN30.KJ4hxcTdmoYmkvdnUn2fRKffzY6k27olLl7Xg8qZQEA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
