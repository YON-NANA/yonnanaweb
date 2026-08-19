const SUPABASE_URL = 'https://pjunvgbppdidkfxktkas.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tJR5Iqp3zO5PBaHMVR8rOA_lBVRqeRj';

async function checkExistingCoordinates() {
  const [lostRes, foundRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/lost_pets?select=*`, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } }),
    fetch(`${SUPABASE_URL}/rest/v1/found_pets?select=*`, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } })
  ]);
  const lostList = await lostRes.json();
  const foundList = await foundRes.json();

  console.log(`=== 迷子データ (${lostList.length}件) ===`);
  lostList.forEach(p => {
    console.log(`[ID: ${p.id}] ${p.pet_name} | 場所: ${p.location} | lat: ${p.lat}, lng: ${p.lng}`);
  });

  console.log(`\n=== 保護データ (${foundList.length}件) ===`);
  foundList.forEach(p => {
    console.log(`[ID: ${p.id}] ${p.reporter_name} | 場所: ${p.location} | lat: ${p.lat}, lng: ${p.lng}`);
  });
}

checkExistingCoordinates();
