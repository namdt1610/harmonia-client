import re
import json
import os

# Đường dẫn thư mục chứa code và file dịch
SRC_DIR = "spotify.django.frontend/Spotify/src"
VI_PATH = "spotify.django.frontend/Spotify/messages/vi.json"
EN_PATH = "spotify.django.frontend/Spotify/messages/en.json"

# Regex hỗ trợ cả nháy đơn, kép, backtick
TRANSLATION_REGEX = re.compile(r"t\(\s*['\"`]([\w.]+)['\"`]\s*\)")

def find_translation_keys(src_dir):
    keys = set()
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                with open(os.path.join(root, file), encoding='utf-8') as f:
                    content = f.read()
                    found = TRANSLATION_REGEX.findall(content)
                    keys.update(found)
    return keys

def load_json(path):
    if not os.path.exists(path):
        print(f"File {path} không tồn tại, sẽ tạo mới.")
        return {}
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def add_missing_keys(keys, translations):
    changed = False
    for key in keys:
        # Hỗ trợ key dạng lồng nhau: "HomePage.title"
        parts = key.split('.')
        d = translations
        for part in parts[:-1]:
            if part not in d or not isinstance(d[part], dict):
                d[part] = {}
            d = d[part]
        if parts[-1] not in d:
            d[parts[-1]] = ""
            changed = True
    return changed

if __name__ == "__main__":
    keys = find_translation_keys(SRC_DIR)
    print(f"Found {len(keys)} translation keys in code.")

    vi = load_json(VI_PATH)
    en = load_json(EN_PATH)

    if add_missing_keys(keys, vi):
        print("Đã bổ sung key còn thiếu vào vi.json")
        save_json(VI_PATH, vi)
    else:
        print("Không có key nào cần bổ sung vào vi.json")

    if add_missing_keys(keys, en):
        print("Đã bổ sung key còn thiếu vào en.json")
        save_json(EN_PATH, en)
    else:
        print("Không có key nào cần bổ sung vào en.json")
