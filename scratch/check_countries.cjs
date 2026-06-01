const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pjbuobkxlltedchzmhzt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnVvYmt4bGx0ZWRjaHptaHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE2MzQ3MSwiZXhwIjoyMDkwNzM5NDcxfQ.sOBNzPXFn8bqPGMSlTNHqK6yvYmLm7fEOppIeOFYF-M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data, error } = await supabase.rpc('execute_sql_temp', {
    sql_query: "SELECT country, count(*), count(distinct city) FROM locations group by country"
  });
  if (error) {
    // If RPC doesn't exist, let's just query a sample chunk to see what countries are there
    console.log('RPC execute_sql_temp not available, fetching distinct countries via JS...');
    let page = 0;
    const countries = new Set();
    while (true) {
      const { data: chunk, error: err } = await supabase
        .from('locations')
        .select('country')
        .range(page * 1000, (page + 1) * 1000 - 1);
      if (err || !chunk || chunk.length === 0) break;
      chunk.forEach(r => countries.add(r.country));
      page++;
      if (page > 85) break;
    }
    console.log('Distinct countries:', Array.from(countries));
  } else {
    console.log('Country stats:', data);
  }
}

check();
