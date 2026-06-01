const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pjbuobkxlltedchzmhzt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnVvYmt4bGx0ZWRjaHptaHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE2MzQ3MSwiZXhwIjoyMDkwNzM5NDcxfQ.sOBNzPXFn8bqPGMSlTNHqK6yvYmLm7fEOppIeOFYF-M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function count() {
  const { data, error } = await supabase
    .from('locations_tr')
    .select('city');
  if (error) {
    console.error('Error:', error);
    return;
  }
  const cities = Array.from(new Set(data.map(d => d.city)));
  console.log('Total rows in locations_tr:', data.length);
  console.log('Total distinct cities in locations_tr:', cities.length);
  console.log('Cities list:', cities);
}

count();
