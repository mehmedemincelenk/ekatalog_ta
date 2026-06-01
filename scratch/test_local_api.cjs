const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function check() {
  try {
    const url = 'http://localhost:3000/api/locations?type=cities&country=T%C3%BCrkiye';
    console.log('Fetching:', url);
    const res = await fetch(url);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response cities length:', data.cities?.length);
    console.log('First 5 cities:', data.cities?.slice(0, 5));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
