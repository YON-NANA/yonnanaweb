// js/api.js
// Supabase REST API 直接呼び出し版（SDK不要）

const SUPABASE_URL = 'https://pjunvgbppdidkfxktkas.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tJR5Iqp3zO5PBaHMVR8rOA_lBVRqeRj';

const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// ─── 共通 fetch ───────────────────────────────────────────────
async function sbFetch(path, options = {}) {
  const res = await fetch(SUPABASE_URL + path, {
    ...options,
    headers: { ...HEADERS, ...(options.headers || {}) }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ─── 画像を軽量な Base64 DataURL に圧縮・変換 ──────────────────
async function compressImageToDataUrl(file, maxWidth = 800, quality = 0.75) {
  if (!file) return null;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG 圧縮した DataURL を取得
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result); // 失敗時はそのまま
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

// ─── Storage: 画像アップロード（フォールバック付き） ───────────
async function processPetImage(file) {
  if (!file) return null;

  // まず軽量圧縮 DataURL を生成（常にフォールバックとして使用可能）
  const compressedDataUrl = await compressImageToDataUrl(file);

  try {
    const ext = file.name ? file.name.split('.').pop() : 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/pet-images/${fileName}`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': file.type || 'image/jpeg',
          'Cache-Control': '3600',
          'x-upsert': 'false'
        },
        body: file
      }
    );

    if (res.ok) {
      return `${SUPABASE_URL}/storage/v1/object/public/pet-images/${fileName}`;
    }
  } catch (err) {
    console.warn('Storage upload unavailable, using compressed DataURL:', err);
  }

  // Storageが利用できない場合は圧縮Base64 DataURLを使用
  return compressedDataUrl;
}

// ─── 迷子登録 ─────────────────────────────────────────────────
async function registerLostPet(petData, imageFile) {
  let imageUrl = petData.image_url || null;
  if (imageFile) {
    imageUrl = await processPetImage(imageFile);
  }

  const payload = {
    pet_name: petData.pet_name || '不明',
    pet_type: petData.pet_type || 'other',
    breed: petData.breed || '',
    gender: petData.gender || '不明',
    features: Array.isArray(petData.features) ? petData.features : [],
    date_lost: petData.date_lost || new Date().toISOString().split('T')[0],
    location: petData.location || '不明',
    lat: typeof petData.lat === 'number' && !isNaN(petData.lat) ? petData.lat : null,
    lng: typeof petData.lng === 'number' && !isNaN(petData.lng) ? petData.lng : null,
    owner_name: petData.owner_name || '',
    email: petData.email || '',
    phone: petData.phone || '',
    details: petData.details || '',
    image_url: imageUrl,
    status: 'searching'
  };

  const data = await sbFetch('/rest/v1/lost_pets', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return Array.isArray(data) ? data[0] : data;
}

// ─── 保護報告 ─────────────────────────────────────────────────
async function registerFoundPet(petData, imageFile) {
  let imageUrl = petData.image_url || null;
  if (imageFile) {
    imageUrl = await processPetImage(imageFile);
  }

  const payload = {
    date_found: petData.date_found || new Date().toISOString().split('T')[0],
    location: petData.location || '不明',
    lat: typeof petData.lat === 'number' && !isNaN(petData.lat) ? petData.lat : null,
    lng: typeof petData.lng === 'number' && !isNaN(petData.lng) ? petData.lng : null,
    reporter_name: petData.reporter_name || '保護・目撃者',
    email: petData.email || '',
    phone: petData.phone || '',
    details: petData.details || '',
    image_url: imageUrl
  };

  const data = await sbFetch('/rest/v1/found_pets', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return Array.isArray(data) ? data[0] : data;
}

// ─── 迷子ペット一覧取得 ────────────────────────────────────────
async function fetchLostPets(limit = 50) {
  try {
    return await sbFetch(`/rest/v1/lost_pets?select=*&order=created_at.desc&limit=${limit}`);
  } catch (e) {
    console.error('fetchLostPets error:', e);
    return [];
  }
}

// ─── 保護ペット一覧取得 ────────────────────────────────────────
async function fetchFoundPets(limit = 50) {
  try {
    return await sbFetch(`/rest/v1/found_pets?select=*&order=created_at.desc&limit=${limit}`);
  } catch (e) {
    console.error('fetchFoundPets error:', e);
    return [];
  }
}

// ─── 個別ペット情報取得 ────────────────────────────────────────
async function fetchPetById(type, id) {
  try {
    const table = type === 'lost' ? 'lost_pets' : 'found_pets';
    const data = await sbFetch(`/rest/v1/${table}?id=eq.${id}&select=*`);
    return data && data.length > 0 ? data[0] : null;
  } catch (e) {
    console.error('fetchPetById error:', e);
    return null;
  }
}

// ─── 情報の更新（ステータス変更等） ────────────────────────
const MASTER_PASSWORD = 'AFC-ADMIN-777';

// ─── パスワードの検証 ────────────────────────────────────────
async function verifyPassword(type, id, password) {
  const table = type === 'lost' ? 'lost_pets' : 'found_pets';
  const record = await sbFetch(`/rest/v1/${table}?id=eq.${id}&select=edit_password`);
  if (!record || record.length === 0) throw new Error('データが見つかりません');
  
  const savedPassword = record[0].edit_password;
  if (password !== MASTER_PASSWORD && savedPassword !== password) {
    throw new Error('パスワードが間違っています。');
  }
  return true;
}

async function updatePetStatus(type, id, newStatus, password) {
  const table = type === 'lost' ? 'lost_pets' : 'found_pets';
  
  // 1. パスワードの検証
  await verifyPassword(type, id, password);

  // 2. 更新の実行
  const payload = { status: newStatus };
  const res = await sbFetch(`/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
  return true;
}

// ─── 情報の削除 ──────────────────────────────────────────────
async function deletePetInfo(type, id, password) {
  const table = type === 'lost' ? 'lost_pets' : 'found_pets';
  
  await verifyPassword(type, id, password);

  await sbFetch(`/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE'
  });
  return true;
}

// ─── 情報のフル更新 ──────────────────────────────────────────────
async function updatePetDetails(type, id, payload, imageFile = null, password = null) {
  const table = type === 'lost' ? 'lost_pets' : 'found_pets';
  
  // パスワードが渡された場合は検証（フロントで事前検証済みならスキップ可）
  if (password) {
    await verifyPassword(type, id, password);
  }

  // 画像が選択されている場合はアップロードしてURLを差し替え
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `images/${fileName}`;
    
    await sbFetch(`/storage/v1/object/pet-images/${filePath}`, {
      method: 'POST',
      body: imageFile
    }, true);
    
    payload.image_url = `https://rnvzryzcfxalmtuofxid.supabase.co/storage/v1/object/public/pet-images/${filePath}`;
  }

  // レコードの更新
  const data = await sbFetch(`/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
  
  return true;
}

// ─── チャットメッセージ取得 ────────────────────────────────────
async function fetchMessages(sessionId) {
  return sbFetch(
    `/rest/v1/messages?session_id=eq.${encodeURIComponent(sessionId)}&order=created_at.asc`
  );
}

// ─── チャットメッセージ送信 ────────────────────────────────────
async function sendMessage(sessionId, senderName, messageText) {
  return sbFetch('/rest/v1/messages', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, sender_name: senderName, message: messageText })
  });
}

// ─── 高精度・日本語住所ジオコーディング ──────────────────────────
async function geocodeAddress(query) {
  if (!query || typeof query !== 'string') return null;
  const cleanQuery = query.trim().replace(/\s+/g, ' ');
  if (!cleanQuery) return null;

  // 試行する検索パターンのリスト
  const candidates = [cleanQuery];
  
  // 数字・番地を除去したパターン
  const noNumbers = cleanQuery.replace(/[0-9０-９\-ー丁目番地号\s]+$/g, '').trim();
  if (noNumbers && noNumbers !== cleanQuery && !candidates.includes(noNumbers)) {
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
        headers: { 'Accept-Language': 'ja' }
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

// グローバル公開
window.api = {
  registerLostPet,
  registerFoundPet,
  fetchLostPets,
  fetchFoundPets,
  fetchPetById,
  verifyPassword,
  updatePetStatus,
  updatePetDetails,
  deletePetInfo,
  fetchMessages,
  sendMessage,
  compressImageToDataUrl,
  geocodeAddress
};


