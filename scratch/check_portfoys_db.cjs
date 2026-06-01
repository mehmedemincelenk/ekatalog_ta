const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pjbuobkxlltedchzmhzt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnVvYmt4bGx0ZWRjaHptaHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE2MzQ3MSwiZXhwIjoyMDkwNzM5NDcxfQ.sOBNzPXFn8bqPGMSlTNHqK6yvYmLm7fEOppIeOFYF-M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  try {
    console.log('Querying count from locations table...');
    const { count: locCount, error: countErr } = await supabase
      .from('locations')
      .select('*', { count: 'exact', head: true });

    if (countErr) {
      console.error('Error getting locations count:', countErr);
    } else {
      console.log('Total locations row count:', locCount);
    }

    console.log('Querying distinct countries in the locations table...');
    let allCountries = [];
    let page = 0;
    const pageSize = 1000;
    let keepFetching = true;

    while (keepFetching) {
      const { data, error } = await supabase
        .from('locations')
        .select('country')
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) {
        console.error('Error fetching chunk:', error);
        break;
      }

      if (data && data.length > 0) {
        allCountries.push(...data.map(d => d.country));
        if (data.length < pageSize) keepFetching = false;
        else page++;
      } else {
        keepFetching = false;
      }
      if (page > 85) keepFetching = false;
    }

    const counts = {};
    for (const c of allCountries) {
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

    console.log('Checking first 5 rows in locations_tr...');
    const { data: trSamples, error: trSamplesError } = await supabase
      .from('locations_tr')
      .select('*')
      .limit(5);

    if (trSamplesError) {
      console.error('Error fetching locations_tr samples:', trSamplesError);
    } else {
      console.log('locations_tr samples:', JSON.stringify(trSamples, null, 2));
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

check();
