const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function check() {
  try {
    const url = 'https://portfoys.pro/api/locations?type=cities&country=T%C3%BCrkiye';
    console.log('Fetching', url);
    const res = await fetch(url);
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response body:', text);
  } catch (err) {
    console.error('Error fetching:', err);
  }
}

check();
