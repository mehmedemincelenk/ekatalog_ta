import { createClient } from '@supabase/supabase-js';

const portfoysSupabase = createClient(
  'https://pjbuobkxlltedchzmhzt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnVvYmt4bGx0ZWRjaHptaHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjM0NzEsImV4cCI6MjA5MDczOTQ3MX0.-Cbccz5lg0ijAixRXTJ-TKQDKqpnajwzbrGjJptMzms'
);

async function run() {
  const { data: deCities, error: deError } = await portfoysSupabase
    .from('locations')
    .select('city')
    .eq('country', 'Almanya');

  const { data: iqCities, error: iqError } = await portfoysSupabase
    .from('locations')
    .select('city')
    .eq('country', 'Irak');

  console.log('DE CITIES:', deError ? deError : Array.from(new Set((deCities || []).map(c => c.city))));
  console.log('IQ CITIES:', iqError ? iqError : Array.from(new Set((iqCities || []).map(c => c.city))));
}

run();
