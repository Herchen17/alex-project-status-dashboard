#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8082
os.chdir('/home/ubuntu/clawd')

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running on all interfaces at port {PORT}")
    print(f"Access kanban board at: http://YOUR_PUBLIC_IP:{PORT}/kanban-board.html")
    httpd.serve_forever()
