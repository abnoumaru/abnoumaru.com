import os
import requests
import json

def fetch_json():
    lastfm_user = os.getenv("LASTFM_USER")
    api_key = os.getenv("API_KEY")
    
    if not lastfm_user or not api_key:
        print("Error: LASTFM_USER or API_KEY environment variables are not set.")
        return
    
    url = f"https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={lastfm_user}&api_key={api_key}&format=json&limit=1"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        # JSONデータをファイルに保存
        with open('public/recent_track.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print("JSON data saved successfully to public/recent_track.json.")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    fetch_json()