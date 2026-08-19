const SUPABASE_URL = 'https://pjunvgbppdidkfxktkas.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tJR5Iqp3zO5PBaHMVR8rOA_lBVRqeRj';

async function checkImages() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lost_pets?select=id,pet_name,image_url,lat,lng&order=created_at.desc&limit=20`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
  const list = await res.json();

  for (const p of list) {
    if (p.image_url) {
      if (p.image_url.startsWith('data:')) {
        console.log(`[${p.pet_name}] IMAGE: BASE64 DataURL (length=${p.image_url.length}) lat=${p.lat} lng=${p.lng}`);
      } else {
        console.log(`[${p.pet_name}] IMAGE: Storage URL = ${p.image_url} | lat=${p.lat} lng=${p.lng}`);
      }
    } else {
      console.log(`[${p.pet_name}] IMAGE: NONE | lat=${p.lat} lng=${p.lng}`);
    }
  }
}
checkImages();
