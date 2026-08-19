async function geocodeAddress(query) {
  if (!query || typeof query !== 'string') return null;
  const cleanQuery = query.trim().replace(/\s+/g, ' ');
  if (!cleanQuery) return null;

  // 試行する検索パターンのリスト
  const candidates = [cleanQuery];
  
  // 数字・番地を除去したパターン
  const noNumbers = cleanQuery.replace(/[0-9０-９\-ー丁目番地号\s]+$/g, '').trim();
  if (noNumbers && noNumbers !== cleanQuery) {
    candidates.push(noNumbers);
  }

  // 市区町村までのパターン
  const matchCity = cleanQuery.match(/^(.+?[都道府県])?(.+?[市区町村])/);
  if (matchCity) {
    const cityOnly = (matchCity[1] || '') + matchCity[2];
    if (cityOnly && !candidates.includes(cityOnly)) {
      candidates.push(cityOnly);
    }
  }

  for (const q of candidates) {
    // 1. 国土地理院 API (日本国内の住所に極めて高精度)
    try {
      const gsiUrl = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(q)}`;
      const res = await fetch(gsiUrl);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].geometry && Array.isArray(data[0].geometry.coordinates)) {
          const [lng, lat] = data[0].geometry.coordinates;
          return {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            displayName: data[0].properties?.title || q,
            source: 'gsi'
          };
        }
      }
    } catch (e) {
      console.warn('GSI geocode error:', e.message);
    }

    // 2. OpenStreetMap Nominatim API (施設名や建物名に強い)
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=ja&countrycodes=jp`;
      const res = await fetch(nomUrl, {
        headers: { 'Accept-Language': 'ja', 'User-Agent': 'AFCPetFinder/1.0' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name || q,
            source: 'nominatim'
          };
        }
      }
    } catch (e) {
      console.warn('Nominatim geocode error:', e.message);
    }
  }

  return null;
}

async function test() {
  const tests = [
    '東京都世田谷区三軒茶屋2丁目',
    '大阪府大阪市北区梅田1-1',
    '神奈川県横浜市中区山下町',
    '福岡県福岡市博多区博多駅中央街',
    '北海道札幌市中央区北1条西2丁目'
  ];
  for (const t of tests) {
    const res = await geocodeAddress(t);
    console.log(t, '=>', res);
  }
}
test();
