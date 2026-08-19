import urllib.request
import re
import json

url = "https://www.env.go.jp/nature/dobutsu/aigo/shuyo/link.html"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    
    # Extract all links
    links = re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', html, re.DOTALL)
    
    results = []
    for href, text in links:
        # Strip HTML tags inside text
        text_clean = re.sub(r'<[^>]+>', '', text).strip()
        if text_clean:
            # Resolve relative URLs
            if href.startswith('.'):
                # Simple relative URL resolver for env.go.jp
                resolved_url = "https://www.env.go.jp/nature/dobutsu/aigo/shuyo/" + href.lstrip('./')
            elif href.startswith('/'):
                resolved_url = "https://www.env.go.jp" + href
            else:
                resolved_url = href
            results.append({"text": text_clean, "url": resolved_url})
            
    print(json.dumps(results, ensure_ascii=False, indent=2))
except Exception as e:
    import sys
    print(f"Error: {e}", file=sys.stderr)
