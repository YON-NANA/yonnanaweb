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
  // DELETE や 204 は本文なし
  if (res.status === 204) return null;
  return res.json();
}

// ─── Storage: 画像アップロード ────────────────────────────────
async function uploadImage(bucket, fileName, file) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': file.type,
        'Cache-Control': '3600',
        'x-upsert': 'false'
      },
      body: file
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error('画像アップロード失敗: ' + (err.message || res.status));
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
}

// ─── 迷子登録 ─────────────────────────────────────────────────
async function registerLostPet(petData, imageFile) {
  let imageUrl = null;
  if (imageFile) {
    const ext = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_lost.${ext}`;
    imageUrl = await uploadImage('pet-images', fileName, imageFile);
  }
  const data = await sbFetch('/rest/v1/lost_pets', {
    method: 'POST',
    body: JSON.stringify({ ...petData, image_url: imageUrl })
  });
  return Array.isArray(data) ? data[0] : data;
}

// ─── 保護報告 ─────────────────────────────────────────────────
async function registerFoundPet(petData, imageFile) {
  let imageUrl = null;
  if (imageFile) {
    const ext = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_found.${ext}`;
    imageUrl = await uploadImage('pet-images', fileName, imageFile);
  }
  const data = await sbFetch('/rest/v1/found_pets', {
    method: 'POST',
    body: JSON.stringify({ ...petData, image_url: imageUrl })
  });
  return Array.isArray(data) ? data[0] : data;
}

// ─── 迷子ペット一覧取得 ────────────────────────────────────────
async function fetchLostPets(limit = 50) {
  return sbFetch(`/rest/v1/lost_pets?select=*&order=created_at.desc&limit=${limit}`);
}

// ─── 保護ペット一覧取得 ────────────────────────────────────────
async function fetchFoundPets(limit = 50) {
  return sbFetch(`/rest/v1/found_pets?select=*&order=created_at.desc&limit=${limit}`);
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

// グローバル公開
window.api = {
  registerLostPet,
  registerFoundPet,
  fetchLostPets,
  fetchFoundPets,
  fetchMessages,
  sendMessage
};

console.log('AFC API (Supabase REST) initialized.');
