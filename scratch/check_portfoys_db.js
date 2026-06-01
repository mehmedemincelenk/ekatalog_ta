const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pjbuobkxlltedchzmhzt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnVvYmt4bGx0ZWRjaHptaHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE2MzQ3MSwiZXhwIjoyMDkwNzM5NDcxfQ.sOBNzPXFn8bqPGMSlTNHqK6yvYmLm7fEOppIeOFYF-M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  try {
    console.log('Querying distinct countries in the locations table...');
    const { data: countries, error: countryError } = await supabase
      .from('locations')
      .select('country')
      .limit(100000); // just fetch a lot or group it

    if (countryError) {
      console.error('Error fetching countries:', countryError);
      return;
    }

    const counts = {};
    for (const row of countries || []) {
      const c = row.country;
      counts[c] = (counts[c] || 0) + 1;
    }
    console.log('Country counts in original locations table:', counts);

    console.log('Checking a few rows in locations table...');
    const { data: samples, error: sampleError } = await supabase
      .from('locations')
      .select('*')
      .limit(5);

    if (sampleError) {
      console.error('Error fetching samples:', sampleError);
    } else {
      console.log('Samples:', samples);
    }

    console.log('Checking locations_tr count...');
    const { count: trCount, error: trError } = await supabase
      .from('locations_tr')
      .select('*', { count: 'exact', head: true });

    if (trError) {
      console.error('Error fetching locations_tr count:', trError);
    } else {
      console.log('locations_tr row count:', trCount);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

check();
