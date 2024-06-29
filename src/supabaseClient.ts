
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://carvjykqiurinadeadzn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcnZqeWtxaXVyaW5hZGVhZHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk2NTQzNzYsImV4cCI6MjAzNTIzMDM3Nn0.xnE3vKO0NDvlrepnuyp9xB1AeajS1Omnth8-ZVbETpA';

export const supabase = createClient(supabaseUrl, supabaseKey);

