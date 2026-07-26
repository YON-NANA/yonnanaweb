/**
 * AFC Pet Finder — Mock Data
 * デモ用サンプルデータ
 */

const MOCK_LOST = [
  {
    id: 'L001',
    type: 'lost',
    animal: 'dog',
    breed: '柴犬',
    name: 'ハナ',
    gender: 'female',
    age: '3歳',
    weight: '9kg',
    colors: ['茶', '白'],
    features: ['首輪あり（青）', '迷子札あり', '避妊済み'],
    personality: 'shy',
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    location: { lat: 35.6812, lng: 139.7671, name: '新宿区西新宿3丁目付近' },
    lostAt: '2026-07-05T08:30:00',
    reportedAt: '2026-07-05T09:00:00',
    description: '朝の散歩中、花火の音に驚いて逐走。臆病な性格のため物陰に隠れている可能性が高い。',
    contact: 'AFC-L001',
    daysElapsed: 2,
    views: 342,
    matches: 2
  },
  {
    id: 'L002',
    type: 'lost',
    animal: 'cat',
    breed: '黒猫（ミックス）',
    name: 'クロ',
    gender: 'male',
    age: '5歳',
    weight: '4.5kg',
    colors: ['黒'],
    features: ['首輪なし', '耳カットあり（地域猫から家猫）', '去勢済み'],
    personality: 'friendly',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    location: { lat: 35.7090, lng: 139.7320, name: '豊島区南池袋1丁目付近' },
    lostAt: '2026-07-06T19:00:00',
    reportedAt: '2026-07-06T21:00:00',
    description: '網戸を破って脱走。人懐っこい性格のため近隣にいる可能性が高い。',
    contact: 'AFC-L002',
    daysElapsed: 1,
    views: 189,
    matches: 1
  },
  {
    id: 'L003',
    type: 'lost',
    animal: 'cat',
    breed: 'サビ猫',
    name: 'モモ',
    gender: 'female',
    age: '2歳',
    weight: '3.2kg',
    colors: ['黒', '茶', 'オレンジ'],
    features: ['首輪あり（赤）', '鍵尻尾', '避妊済み'],
    personality: 'shy',
    photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
    location: { lat: 35.6583, lng: 139.7458, name: '渋谷区代官山町付近' },
    lostAt: '2026-07-03T14:00:00',
    reportedAt: '2026-07-03T15:30:00',
    description: '引越し直後に脱走。慣れない場所で強いストレスを受けている状態。',
    contact: 'AFC-L003',
    daysElapsed: 4,
    views: 521,
    matches: 3
  },
  {
    id: 'L004',
    type: 'lost',
    animal: 'dog',
    breed: 'トイプードル',
    name: 'ラテ',
    gender: 'male',
    age: '4歳',
    weight: '4kg',
    colors: ['アプリコット'],
    features: ['首輪あり（ピンク）', '迷子札あり', '去勢済み'],
    personality: 'friendly',
    photo: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=400&h=300&fit=crop',
    location: { lat: 35.6894, lng: 139.6917, name: '中野区中野5丁目付近' },
    lostAt: '2026-07-07T10:00:00',
    reportedAt: '2026-07-07T10:30:00',
    description: '今朝、リード外れて逐走。よく吠えるため声を聞いた方はご一報を。',
    contact: 'AFC-L004',
    daysElapsed: 0,
    views: 98,
    matches: 0
  },
  {
    id: 'L005',
    type: 'lost',
    animal: 'cat',
    breed: 'キジトラ',
    name: 'トラ',
    gender: 'male',
    age: '7歳',
    weight: '5.8kg',
    colors: ['茶', '黒（トラ縞）'],
    features: ['首輪なし', '去勢済み', '左耳に傷あり'],
    personality: 'shy',
    photo: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&h=300&fit=crop',
    location: { lat: 35.6762, lng: 139.6503, name: '杉並区阿佐谷南2丁目付近' },
    lostAt: '2026-07-01T22:00:00',
    reportedAt: '2026-07-02T08:00:00',
    description: '6日間行方不明。人見知りが強いため、捕獲器の設置を検討中。',
    contact: 'AFC-L005',
    daysElapsed: 6,
    views: 876,
    matches: 4
  }
];

const MOCK_FOUND = [
  {
    id: 'F001',
    type: 'found',
    animal: 'cat',
    breed: '黒猫系',
    gender: 'male',
    colors: ['黒'],
    features: ['首輪なし', '耳カットあり'],
    photo: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&h=300&fit=crop',
    location: { lat: 35.7102, lng: 139.7345, name: '豊島区東池袋2丁目' },
    foundAt: '2026-07-06T20:30:00',
    reportedAt: '2026-07-06T21:00:00',
    description: '駐車場の隅にいるのを発見。人懐っこく近寄ってきた。現在、一時保護中。',
    contact: 'AFC-F001',
    matchScore: 92,
    matchedWith: 'L002'
  },
  {
    id: 'F002',
    type: 'found',
    animal: 'cat',
    breed: 'サビ猫系',
    gender: 'unknown',
    colors: ['黒', 'オレンジ', '茶'],
    features: ['首輪あり（赤）', '短い尻尾'],
    photo: 'https://images.unsplash.com/photo-1501820488136-72669149e0d4?w=400&h=300&fit=crop',
    location: { lat: 35.6571, lng: 139.7382, name: '渋谷区恵比寿1丁目' },
    foundAt: '2026-07-06T16:00:00',
    reportedAt: '2026-07-06T16:30:00',
    description: '店舗裏で鳴いているのを発見。首輪の赤い猫。現在、保護中。',
    contact: 'AFC-F002',
    matchScore: 88,
    matchedWith: 'L003'
  },
  {
    id: 'F003',
    type: 'found',
    animal: 'dog',
    breed: '柴犬系',
    gender: 'female',
    colors: ['茶', '白'],
    features: ['首輪あり（青）', '迷子札あり'],
    photo: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=300&fit=crop',
    location: { lat: 35.6798, lng: 139.7543, name: '新宿区新宿2丁目' },
    foundAt: '2026-07-05T14:00:00',
    reportedAt: '2026-07-05T14:20:00',
    description: '新宿御苑近くで保護。おとなしく怯えている様子。',
    contact: 'AFC-F003',
    matchScore: 95,
    matchedWith: 'L001'
  }
];

const MOCK_WITNESS = [
  {
    id: 'W001',
    type: 'witness',
    animal: 'cat',
    colors: ['黒'],
    photo: null,
    location: { lat: 35.7120, lng: 139.7290, name: '豊島区南池袋3丁目' },
    witnessAt: '2026-07-07T07:00:00',
    description: '黒猫を道路の反対側で見かけた。耳カットあり。',
    contact: 'AFC-W001'
  },
  {
    id: 'W002',
    type: 'witness',
    animal: 'dog',
    colors: ['茶', '白'],
    photo: null,
    location: { lat: 35.6840, lng: 139.7610, name: '新宿区大京町' },
    witnessAt: '2026-07-05T11:30:00',
    description: '青い首輪の柴犬が公園近くの茂みに隠れていた。',
    contact: 'AFC-W002'
  }
];

const MOCK_GOVT_DATA = [
  {
    id: 'G001',
    source: '東京都動物愛護相談センター',
    animal: 'cat',
    gender: 'male',
    colors: ['黒', '白'],
    features: ['首輪なし'],
    photo: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&h=300&fit=crop',
    protectedAt: '2026-07-06',
    location: '新宿区内',
    status: '収容中',
    url: 'https://www.fukushihoken.metro.tokyo.lg.jp/douso/',
    matchScore: 61
  },
  {
    id: 'G002',
    source: '警察庁 遺失物データベース',
    animal: 'dog',
    gender: 'unknown',
    colors: ['アプリコット'],
    features: ['首輪あり（ピンク系）'],
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    protectedAt: '2026-07-07',
    location: '中野区内',
    status: '収容中',
    url: 'https://www.npa.go.jp/bureau/soumu/ishitsubutsu/',
    matchScore: 87
  },
  {
    id: 'G003',
    source: '杉並区保健センター',
    animal: 'cat',
    gender: 'male',
    colors: ['茶', '黒（トラ縞）'],
    features: ['首輪なし', '大きな猫'],
    photo: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=300&fit=crop',
    protectedAt: '2026-07-04',
    location: '杉並区内',
    status: '収容中',
    url: 'https://www.city.suginami.tokyo.jp/',
    matchScore: 79
  }
];

// Heatmap prediction data generator
function generateHeatmapData(lostPet, weather = 'sunny', temp = 25) {
  const { lat, lng, lostAt } = lostPet.location ? { lat: lostPet.location.lat, lng: lostPet.location.lng, lostAt: lostPet.lostAt } : {};
  const days = lostPet.daysElapsed || 0;

  // Base radius by animal type & personality
  let baseRadius = 0.005;
  if (lostPet.animal === 'dog') {
    baseRadius = lostPet.personality === 'friendly' ? 0.012 : 0.006;
  } else {
    baseRadius = lostPet.personality === 'shy' ? 0.003 : 0.008;
  }

  // Weather modifier
  const weatherMod = { 'sunny': 1.2, 'cloudy': 1.0, 'rainy': 0.6, 'stormy': 0.4 }[weather] || 1.0;

  // Temperature modifier (extreme temps reduce range)
  const tempMod = temp < 10 ? 0.7 : temp > 35 ? 0.6 : 1.0;

  // Days elapsed modifier
  const dayMod = Math.min(1 + (days * 0.3), 3.0);

  const radius = baseRadius * weatherMod * tempMod * dayMod;

  // Generate probability points
  const points = [];
  const numPoints = 40;

  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const r = Math.random() * radius;
    const intensity = Math.exp(-r / (radius * 0.5)) * (0.5 + Math.random() * 0.5);

    points.push([
      lostPet.location.lat + r * Math.cos(angle) * (1 + Math.random() * 0.3),
      lostPet.location.lng + r * Math.sin(angle) * (1 + Math.random() * 0.3),
      intensity
    ]);
  }

  // Add hotspots (shelter areas, parks, etc.)
  const hotspots = [
    { dlat: 0, dlng: 0, intensity: 0.9 },
    { dlat: radius * 0.3, dlng: radius * 0.2, intensity: 0.7 },
    { dlat: -radius * 0.4, dlng: radius * 0.1, intensity: 0.6 }
  ];

  hotspots.forEach(hs => {
    for (let j = 0; j < 8; j++) {
      points.push([
        lostPet.location.lat + hs.dlat + (Math.random() - 0.5) * 0.001,
        lostPet.location.lng + hs.dlng + (Math.random() - 0.5) * 0.001,
        hs.intensity * (0.7 + Math.random() * 0.3)
      ]);
    }
  });

  return { points, radius, metadata: { weatherMod, tempMod, dayMod } };
}

// Tag matching algorithm
function calcMatchScore(lostPet, foundPet) {
  let score = 0;
  let maxScore = 0;

  // Animal type (critical)
  maxScore += 30;
  if (lostPet.animal === foundPet.animal) score += 30;

  // Gender
  maxScore += 10;
  if (foundPet.gender === 'unknown' || lostPet.gender === foundPet.gender) score += 10;

  // Colors
  maxScore += 25;
  const colorMatches = (lostPet.colors || []).filter(c => (foundPet.colors || []).includes(c)).length;
  const colorScore = Math.min(colorMatches / Math.max(lostPet.colors?.length || 1, 1), 1) * 25;
  score += colorScore;

  // Features
  maxScore += 20;
  const featMatches = (lostPet.features || []).filter(f =>
    (foundPet.features || []).some(ff => ff.includes(f.split('（')[0]))
  ).length;
  const featScore = Math.min(featMatches / Math.max(lostPet.features?.length || 1, 1), 1) * 20;
  score += featScore;

  // Breed similarity
  maxScore += 15;
  if (lostPet.breed && foundPet.breed) {
    const lb = lostPet.breed.toLowerCase();
    const fb = foundPet.breed.toLowerCase();
    if (lb === fb) score += 15;
    else if (lb.includes(fb.split(/[（(]/)[0]) || fb.includes(lb.split(/[（(]/)[0])) score += 8;
  }

  return Math.round((score / maxScore) * 100);
}

// Format date
function formatDate(isoStr) {
  const d = new Date(isoStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}年${m}月${day}日 ${h}:${min}`;
}

function daysAgo(isoStr) {
  const now = new Date();
  const d = new Date(isoStr);
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return '本日';
  if (diff === 1) return '1日前';
  return `${diff}日前`;
}

// Stats
const MOCK_STATS = {
  totalLost: 1247,
  totalFound: 983,
  reunited: 812,
  successRate: 65,
  todayLost: 8,
  todayFound: 5
};

// Govt agency list
const GOVT_AGENCIES = [
  { name: '東京都動物愛護相談センター（本所）', area: '東京都全域', tel: '03-3302-3507', url: 'https://www.fukushihoken.metro.tokyo.lg.jp/douso/', updates: '毎日' },
  { name: '神奈川県動物保護センター', area: '神奈川県全域', tel: '045-471-2111', url: 'https://www.pref.kanagawa.jp/docs/t4e/cnt/f6228/', updates: '平日' },
  { name: '埼玉県動物指導センター', area: '埼玉県全域', tel: '048-536-2111', url: 'https://www.pref.saitama.lg.jp/b0101/doushien.html', updates: '平日' },
  { name: '千葉県動物保護指導センター', area: '千葉県全域', tel: '043-241-4356', url: 'https://www.pref.chiba.lg.jp/doshisou/', updates: '平日' }
];

window.MOCK_DATA = {
  lost: MOCK_LOST,
  found: MOCK_FOUND,
  witness: MOCK_WITNESS,
  govtData: MOCK_GOVT_DATA,
  govtAgencies: GOVT_AGENCIES,
  stats: MOCK_STATS,
  generateHeatmapData,
  calcMatchScore,
  formatDate,
  daysAgo
};
