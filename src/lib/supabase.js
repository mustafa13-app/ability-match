import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cmpckapqotdhczregwco.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcGNrYXBxb3RkaGN6cmVnd2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NzY1OTcsImV4cCI6MjA5MjI1MjU5N30.ruuPb961bBx6xXhBIvdFV1hRWEWxWLqF8mtYz_V1q3c'

export const supabase = createClient(supabaseUrl, supabaseKey)