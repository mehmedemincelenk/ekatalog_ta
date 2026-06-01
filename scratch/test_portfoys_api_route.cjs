const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function check() {
  try {
    const res = await fetch('https://portfoys.pro/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    console.log('Search POST Status:', res.status);
    const text = await res.text();
    console.log('Search POST Body:', text.slice(0, 500));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
