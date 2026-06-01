const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://pjbuobkxlltedchzmhzt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnVvYmt4bGx0ZWRjaHptaHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE2MzQ3MSwiZXhwIjoyMDkwNzM5NDcxfQ.sOBNzPXFn8bqPGMSlTNHqK6yvYmLm7fEOppIeOFYF-M'
);

async function run() {
  console.log('Fetching ALL unique countries and cities from database with correct 1000 page size pagination...');
  let page = 0;
  const pageSize = 1000;
  let keepFetching = true;
  const uniqueCitiesByCountry = {};

  while (keepFetching) {
    const { data, error } = await supabase
      .from('locations')
      .select('country, city')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error('Error fetching:', error);
      break;
    }

    if (data && data.length > 0) {
      data.forEach(row => {
        const country = row.country || 'Türkiye';
        const city = row.city;
        if (!uniqueCitiesByCountry[country]) {
          uniqueCitiesByCountry[country] = new Set();
        }
        uniqueCitiesByCountry[country].add(city);
      });
      
      if (page % 10 === 0) {
        console.log(`Fetched page ${page}, rows count: ${data.length}. Unique cities gathered so far:`, 
          Object.keys(uniqueCitiesByCountry).reduce((acc, c) => ({ ...acc, [c]: uniqueCitiesByCountry[c].size }), {})
        );
      }
      
      if (data.length < pageSize) {
        keepFetching = false;
      } else {
        page++;
      }
    } else {
      keepFetching = false;
    }
    
    if (page > 100) {
      console.log('Safety break at page 100');
      break;
    }
  }

  console.log('--- FINAL SUMMARY ---');
  for (const country in uniqueCitiesByCountry) {
    const citiesArray = Array.from(uniqueCitiesByCountry[country]).sort();
    console.log(`Country: ${country} (${citiesArray.length} cities)`);
    console.log('Cities:', citiesArray.join(', '));
  }
}

run();
