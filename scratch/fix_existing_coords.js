const SUPABASE_URL = 'https://pjunvgbppdidkfxktkas.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tJR5Iqp3zO5PBaHMVR8rOA_lBVRqeRj';

async function geocodeAddress(query) {
  if (!query || typeof query !== 'string') return null;
  const cleanQuery = query.trim().replace(/\s+/g, ' ');
  if (!cleanQuery || cleanQuery === '不明' || cleanQuery === 'test' || cleanQuery === 'テスト') return null;

  const candidates = [cleanQuery];
  const noNumbers = cleanQuery.replace(/[0-9０-９\-ー丁目番地号\s]+$/g, '').trim();
  if (noNumbers && noNumbers !== cleanQuery && !candidates.includes(noNumbers)) {
    candidates.push(noNumbers);
  }
  const matchCity = cleanQuery.match(/^(.+?[都道府県])?(.+?[市区町村])/);
  if (matchCity) {
    const cityOnly = (matchCity[1] || '') + matchCity[2];
    if (cityOnly && !candidates.includes(cityOnly)) {
      candidates.push(cityOnly);
    }
  }

  for (const q of candidates) {
    try {
      const gsiUrl = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(q)}`;
      const res = await fetch(gsiUrl);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].geometry?.coordinates) {
          const [lng, lat] = data[0].geometry.coordinates;
          return { lat: parseFloat(lat), lng: parseFloat(lng), name: data[0].properties?.title || q };
        }
      }
    } catch (e) {}

    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=ja&countrycodes=jp`;
      const res = await fetch(nomUrl, { headers: { 'Accept-Language': 'ja' } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name || q };
        }
      }
    } catch (e) {}
  }
  return null;
}

async function fixExistingCoords() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lost_pets?select=*`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
  const list = await res.json();

  for (const p of list) {
    // 徳島県などの住所なのに東京(35.6895, 139.6917)や 0, null になっているものを修正
    const isDefaultTokyo = Math.abs(p.lat - 35.6895) < 0.001 && Math.abs(p.lng - 139.6917) < 0.001 && !p.location.includes('新宿') && !p.location.includes('東京');
    const isInvalid = !p.lat || !p.lng || p.lat === 0 || p.lng === 0 || isDefaultTokyo;

    if (isInvalid && p.location && p.location !== '不明' && p.location !== 'test' && p.location !== 'テスト') {
      console.log(`Fixing [${p.pet_name}] location: "${p.location}" (current: ${p.lat}, ${p.lng})`);
      const geo = await geocodeAddress(p.location);
      if (geo) {
        console.log(` -> Found new coords: lat=${geo.lat}, lng=${geo.lng} (${geo.name})`);
        const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/lost_pets?id=eq.${p.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ lat: geo.lat, lng: geo.lng })
        });
        console.log(` -> Update status:`, updateRes.status);
      } else {
        console.log(` -> Could not geocode "${p.location}"`);
      }
    }
  }
}

fixExistingCoords();
