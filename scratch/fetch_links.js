const https = require('https');

https.get('https://www.env.go.jp/nature/dobutsu/aigo/shuyo/link.html', (res) => {
  let data = Buffer.alloc(0);
  res.on('data', (chunk) => {
    data = Buffer.concat([data, chunk]);
  });
  res.on('end', () => {
    // Decode Shift-JIS or UTF-8?
    // Environmental ministry uses UTF-8 usually, but let's check
    const html = data.toString('utf8');
    
    // We look for table rows or lists containing prefectures.
    // The page structure typically lists:
    // <th>北海道</th><td><a href="URL">...</a></td>
    // Let's search for matches of prefecture names and URLs.
    
    const prefs = [
      "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
      "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
      "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
      "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
      "鳥取県", "島根県", "岡山県", "広島県", "山口県",
      "徳島県", "香川県", "愛媛県", "高知県",
      "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
    ];
    
    const results = {};
    
    // Simple parser: find all anchors
    const regex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const allLinks = [];
    while ((match = regex.exec(html)) !== null) {
      const url = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      allLinks.push({ text, url });
    }
    
    // Let's match prefectures in the text or surrounding HTML
    // Often the text of the link itself is the prefecture name or "〇〇県ホームページ" or similar.
    // Or it's a table layout: <th>Prefectures</th><td><a href="url">link</a></td>
    // Let's search the HTML directly for: <th>Prefecture</th> ... <a href="url">
    
    // Let's output all links first to see the structure.
    console.log(JSON.stringify(allLinks, null, 2));
  });
}).on('error', (err) => {
  console.error("Error: " + err.message);
});
