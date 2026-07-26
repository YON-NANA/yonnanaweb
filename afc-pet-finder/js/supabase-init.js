// js/supabase-init.js

const SUPABASE_URL = 'https://pjunvgbppdidkfxktkas.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tJR5Iqp3zO5PBaHMVR8rOA_lBVRqeRj';

// Supabase v2 CDN では window.supabase.createClient でアクセスする
// （CDNが @supabase/supabase-js を window.supabase として公開する）
let _client;
if (typeof window !== 'undefined') {
  // v2 UMD形式: { createClient } が window.supabase に入る
  const createFn = (window.supabase && window.supabase.createClient)
    ? window.supabase.createClient
    : (window.supabaseJs && window.supabaseJs.createClient)
    ? window.supabaseJs.createClient
    : null;

  if (createFn) {
    _client = createFn(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.error('Supabase SDK が読み込まれていません。CDNのURLを確認してください。');
  }
}

window.db = _client;
