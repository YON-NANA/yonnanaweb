const SUPABASE_URL = 'https://pjunvgbppdidkfxktkas.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tJR5Iqp3zO5PBaHMVR8rOA_lBVRqeRj';

async function testUpdate() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lost_pets?id=eq.a76b0d6b-86c4-416b-9438-20962841a050`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ lat: 34.106079, lng: 134.574356 })
  });
  console.log('Status:', res.status);
  const data = await res.json().catch(() => null);
  console.log('Returned data:', data);
}

testUpdate();
