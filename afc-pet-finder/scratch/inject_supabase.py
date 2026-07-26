import os
import glob
import re

target_dir = r"c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder"
html_files = glob.glob(os.path.join(target_dir, "*.html"))

supabase_tags = """
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-init.js"></script>
<script src="js/api.js"></script>
"""

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # すでに挿入されていないか確認
    if 'supabase-js@2' not in content:
        # </body> の直前に挿入
        new_content = re.sub(r'</body>', f'{supabase_tags}</body>', content, flags=re.IGNORECASE)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {os.path.basename(filepath)}")
    else:
        print(f"Skipped (already exists): {os.path.basename(filepath)}")
