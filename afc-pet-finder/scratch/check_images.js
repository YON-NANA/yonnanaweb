const SUPABASE_URL = 'https://pjunvgbppdidkfxktkas.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tJR5Iqp3zO5PBaHMVR8rOA_lBVRqeRj';

async function checkImagesInDB() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lost_pets?select=id,pet_name,image_url,lat,lng,location`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
  const list = await res.json();
  
  console.log(`=== 迷子データ画像チェック (${list.length}件) ===`);
  list.forEach(p => {
    const imgType = p.image_url 
      ? (p.image_url.startsWith('data:') ? 'Base64 (' + Math.round(p.image_url.length/1024) + 'KB)' 
         : p.image_url.startsWith('http') ? 'URL: ' + p.image_url.substring(0, 60) 
         : 'Other') 
      : 'なし';
    console.log(`[${p.pet_name}] img: ${imgType} | lat: ${p.lat}, lng: ${p.lng}`);
  });
}

checkImagesInDB();
