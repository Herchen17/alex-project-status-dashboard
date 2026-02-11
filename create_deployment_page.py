import base64
import json

# Read the HTML file
with open('kanban-board.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Create a self-contained HTML with all data embedded
deployment_html = f"""<!DOCTYPE html>
<html>
<head>
<title>Download Kanban Board</title>
<style>
body {{
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background: #1a1a1a;
    color: #fff;
}}
.download-btn {{
    background: #00ff88;
    color: #000;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin: 20px 0;
}}
.download-btn:hover {{
    background: #00cc6a;
}}
.instructions {{
    background: rgba(255,255,255,0.1);
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
}}
</style>
</head>
<body>
<h1>🪖 Project Command Center</h1>
<p>Your Kanban board is ready for download!</p>

<a href="#" onclick="downloadKanban()" class="download-btn">📋 Download Kanban Board</a>

<div class="instructions">
<h3>Instructions:</h3>
<ol>
<li>Click the download button above</li>
<li>Save the file as "kanban-board.html"</li>
<li>Open the downloaded file in your web browser</li>
<li>Enjoy your fully functional project tracking system!</li>
</ol>
</div>

<script>
function downloadKanban() {{
    const htmlContent = {json.dumps(html_content)};
    const blob = new Blob([htmlContent], {{ type: 'text/html' }});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kanban-board.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}}
</script>
</body>
</html>"""

# Write the deployment page
with open('download-kanban.html', 'w', encoding='utf-8') as f:
    f.write(deployment_html)

print("✅ Download page created: download-kanban.html")
