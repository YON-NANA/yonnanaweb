const https = require('https');
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../admin-data.html');

https.get('https://www.env.go.jp/nature/dobutsu/aigo/shuyo/link.html', (res) => {
  let data = Buffer.alloc(0);
  res.on('data', (chunk) => {
    data = Buffer.concat([data, chunk]);
  });
  res.on('end', () => {
    const html = data.toString('utf8');
    
    // Extract all links
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
      
      const isPref = name.endsWith('県') || name.endsWith('府') || name === '東京都' || name === '北海道';
      
      if (isPref) {
        lastPref = name;
        prefData[name] = {
          name: name,
          url: url,
          sub: []
        };
      } else if (lastPref && (name.endsWith('市') || name.endsWith('区') || name === '犬' || name === '猫' || name === '県全域' || name === '秋田市')) {
        if (name === '犬' || name === '猫') {
          name = lastPref + '(' + name + ')';
        }
        // Exclude footer links
        if (!name.includes('トップ') && !name.includes('著作権')) {
          prefData[lastPref].sub.push({
            name: name,
            url: url
          });
        }
      }
    });
    
    const regionsResult = [];
    const customUrls = {};
    
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
          if (data.sub && data.sub.length > 0) {
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
            regionItem.prefs.push(prefName);
            customUrls[prefName] = overrides[prefName] || data.url;
          }
        } else {
          regionItem.prefs.push(prefName);
          if (overrides[prefName]) {
            customUrls[prefName] = overrides[prefName];
          }
        }
      });
      
      regionsResult.push(regionItem);
    }
    
    // Read admin-data.html
    let content = fs.readFileSync(targetFile, 'utf8');
    
    // Replace regions array
    const startRegionsIdx = content.indexOf('const regions = [');
    const endRegionsIdx = content.indexOf('];', startRegionsIdx) + 2;
    
    const startUrlsIdx = content.indexOf('const customUrls = {');
    const endUrlsIdx = content.indexOf('};', startUrlsIdx) + 2;
    
    if (startRegionsIdx === -1 || startUrlsIdx === -1) {
      console.error("Could not find replacement tokens in admin-data.html");
      process.exit(1);
    }
    
    // Replace customUrls first (which is further down, so we do it in a safe order or replace both together)
    // Actually we can reconstruct the whole script part or replace carefully.
    const newRegionsStr = `const regions = ${JSON.stringify(regionsResult, null, 2)};`;
    const newUrlsStr = `const customUrls = ${JSON.stringify(customUrls, null, 2)};`;
    
    // Since customUrls is after regions, let's splice carefully or just do replacement string match
    // Let's do regex replacement for regions
    content = content.replace(/const regions = \[\s*[\s\S]*?\n\s*\];/i, newRegionsStr);
    content = content.replace(/const customUrls = \{\s*[\s\S]*?\n\s*\};/i, newUrlsStr);
    
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log("Successfully updated admin-data.html with all Environment Ministry links!");
  });
}).on('error', (err) => {
  console.error("Error: " + err.message);
});
