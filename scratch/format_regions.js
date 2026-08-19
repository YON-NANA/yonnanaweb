const https = require('https');

https.get('https://www.env.go.jp/nature/dobutsu/aigo/shuyo/link.html', (res) => {
  let data = Buffer.alloc(0);
  res.on('data', (chunk) => {
    data = Buffer.concat([data, chunk]);
  });
  res.on('end', () => {
    const html = data.toString('utf8');
    
    // We want to find all anchors
    const regex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const allLinks = [];
    while ((match = regex.exec(html)) !== null) {
      const url = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        allLinks.push({ text, url });
      }
    }
    
    const regionsMap = {
      "北海道・東北": ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
      "関東": ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
      "中部": ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
      "近畿": ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
      "中国": ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
      "四国": ["徳島県", "香川県", "愛媛県", "高知県"],
      "九州・沖縄": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
    };
    
    // Grouping municipalities under prefectures
    const prefData = {};
    let lastPref = null;
    
    allLinks.forEach(item => {
      let name = item.text;
      let url = item.url.trim();
      
      // Resolve relative URLs
      if (url.startsWith('.')) {
        url = "https://www.env.go.jp/nature/dobutsu/aigo/shuyo/" + url.replace(/^\.+\//, '');
      } else if (url.startsWith('/')) {
        url = "https://www.env.go.jp" + url;
      }
      
      // Check if it's a prefecture
      const isPref = name.endsWith('県') || name.endsWith('府') || name === '東京都' || name === '北海道';
      
      if (isPref) {
        lastPref = name;
        prefData[name] = {
          name: name,
          url: url,
          sub: []
        };
      } else if (lastPref && (name.endsWith('市') || name.endsWith('区') || name === '犬' || name === '猫' || name === '県全域' || name === '秋田市')) {
        // Special case for Hiroshima "犬", "猫" links, we can rename them or include them
        if (name === '犬' || name === '猫') {
          name = lastPref + '(' + name + ')';
        }
        prefData[lastPref].sub.push({
          name: name,
          url: url
        });
      }
    });
    
    // Format into regions
    const regionsResult = [];
    const customUrls = {};
    
    // Some manual overrides/fixes for Tokushima, Hokkaido, Iwate, Miyagi, Akita
    // To ensure the user's provided URLs take precedence
    const overrides = {
      "北海道": "https://www.pref.hokkaido.lg.jp/ks/awc/partner.html",
      "岩手県": "https://www.pref.iwate.jp/engan/hoken/1014120/1014123.html",
      "宮城県": "https://www.pref.miyagi.jp/soshiki/doubutuaigo/hogoaigo.html",
      "秋田県": "https://wannyapia.akita.jp/pages/helpdesk",
      "徳島県": "https://douai-tokushima.com/stray/"
    };
    
    for (const [regionName, prefList] of Object.entries(regionsMap)) {
      const regionItem = { name: regionName, prefs: [] };
      
      prefList.forEach(prefName => {
        const data = prefData[prefName];
        
        if (data) {
          // If there are sub-municipalities or we want to output it as a sub structure
          if (data.sub && data.sub.length > 0) {
            // Include the prefecture itself in sub list if it has a URL
            const subList = [];
            const mainUrl = overrides[prefName] || data.url;
            subList.push({ name: "県全域", url: mainUrl });
            
            data.sub.forEach(s => {
              subList.push({ name: s.name, url: s.url });
            });
            
            regionItem.prefs.push({
              name: prefName,
              sub: subList
            });
          } else {
            // Just a string if no sub links
            regionItem.prefs.push(prefName);
            customUrls[prefName] = overrides[prefName] || data.url;
          }
        } else {
          // Fallback if not found in environmental ministry list
          regionItem.prefs.push(prefName);
          if (overrides[prefName]) {
            customUrls[prefName] = overrides[prefName];
          }
        }
      });
      
      regionsResult.push(regionItem);
    }
    
    // Now let's print the exact code we can replace in admin-data.html
    console.log("=== REGIONS ARRAY ===");
    console.log(JSON.stringify(regionsResult, null, 2));
    console.log("=== CUSTOM URLS ===");
    console.log(JSON.stringify(customUrls, null, 2));
  });
}).on('error', (err) => {
  console.error("Error: " + err.message);
});
