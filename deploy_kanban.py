import requests
import json
import base64

# Read the HTML file
with open('kanban-board.html', 'r') as f:
    html_content = f.read()

# Create GitHub Gist (anonymous)
gist_data = {
    "description": "🪖 Soldier's Project Command Center",
    "public": True,
    "files": {
        "kanban-board.html": {
            "content": html_content
        }
    }
}

try:
    response = requests.post('https://api.github.com/gists', json=gist_data)
    if response.status_code == 201:
        gist_url = response.json()['html_url']
        raw_url = response.json()['files']['kanban-board.html']['raw_url']
        print(f"✅ KANBAN DEPLOYED TO WEB:")
        print(f"📋 Direct Access: {raw_url}")
        print(f"🔗 GitHub Gist: {gist_url}")
    else:
        print(f"❌ Deployment failed: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Error: {e}")
