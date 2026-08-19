const SUPABASE_URL = 'https://pjunvgbppdidkfxktkas.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tJR5Iqp3zO5PBaHMVR8rOA_lBVRqeRj';

async function fetchLost() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lost_pets?select=*&order=created_at.desc&limit=10`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  });
  const data = await res.json();
  console.log('Lost pets count:', data.length);
  if (data.length > 0) {
    console.log('Sample lost pet:', data[0]);
  }
}

fetchLost();
