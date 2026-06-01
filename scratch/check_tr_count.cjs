const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pjbuobkxlltedchzmhzt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnVvYmt4bGx0ZWRjaHptaHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE2MzQ3MSwiZXhwIjoyMDkwNzM5NDcxfQ.sOBNzPXFn8bqPGMSlTNHqK6yvYmLm7fEOppIeOFYF-M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { count: trCount } = await supabase.from('locations_tr').select('*', { count: 'exact', head: true });
  const { count: iqCount } = await supabase.from('locations_iq').select('*', { count: 'exact', head: true });
  const { count: deCount } = await supabase.from('locations_de').select('*', { count: 'exact', head: true });
  
  console.log('locations_tr row count:', trCount);
  console.log('locations_iq row count:', iqCount);
  console.log('locations_de row count:', deCount);
}

check();
