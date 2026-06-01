const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function check() {
  try {
    const url = 'http://localhost:3000/api/locations?type=districts&country=T%C3%BCrkiye&city=Adana';
    console.log('Fetching:', url);
    const res = await fetch(url);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response districts:', data.districts);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
