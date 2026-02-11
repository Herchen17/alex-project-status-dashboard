#!/usr/bin/env python3
"""
System Dashboard API Server
Provides real-time system data for the web dashboard
"""

import json
import subprocess
import re
import os
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

class DashboardAPI(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == '/':
            # Serve the dashboard HTML
            self.serve_dashboard()
        elif path == '/api/system-status':
            # Serve system data as JSON
            self.serve_system_data()
        else:
            self.send_error(404)
    
    def serve_dashboard(self):
        try:
            with open('/home/ubuntu/clawd/system-dashboard.html', 'r') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(content.encode())
        except FileNotFoundError:
            self.send_error(404, "Dashboard file not found")
    
    def serve_system_data(self):
        try:
            data = self.get_system_data()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        except Exception as e:
            self.send_error(500, f"Error getting system data: {str(e)}")
    
    def get_system_data(self):
        """Gather real system data"""
        data = {}
        
        # Get disk usage
        try:
            disk_output = subprocess.check_output(['df', '-h', '/'], text=True)
            lines = disk_output.strip().split('\n')
            if len(lines) >= 2:
                parts = lines[1].split()
                total = parts[1]
                used = parts[2]
                available = parts[3]
                percent_str = parts[4].replace('%', '')
                percentage = int(percent_str)
                
                data['disk'] = {
                    'percentage': percentage,
                    'available': available,
                    'total': total,
                    'used': used,
                    'status': 'critical' if percentage >= 90 else 'warning' if percentage >= 80 else 'good'
                }
        except:
            data['disk'] = {
                'percentage': 0,
                'available': 'Unknown',
                'total': 'Unknown',
                'status': 'unknown'
            }
        
        # Get memory usage
        try:
            mem_output = subprocess.check_output(['free', '-h'], text=True)
            lines = mem_output.strip().split('\n')
            if len(lines) >= 2:
                parts = lines[1].split()
                total_mem = parts[1]
                used_mem = parts[2]
                memory_info = f"{used_mem}/{total_mem}"
            else:
                memory_info = "Unknown"
        except:
            memory_info = "Unknown"
        
        # Get uptime
        try:
            uptime_output = subprocess.check_output(['uptime', '-p'], text=True)
            uptime = uptime_output.strip().replace('up ', '')
        except:
            uptime = "Unknown"
        
        # Get Clawdbot status
        try:
            clawdbot_status = subprocess.check_output(['clawdbot', 'status'], text=True)
            
            # Parse session count
            session_match = re.search(r'sessions (\d+)', clawdbot_status)
            session_count = int(session_match.group(1)) if session_match else 0
            
            # Parse model info
            model_match = re.search(r'default ([\w-]+)', clawdbot_status)
            current_model = model_match.group(1) if model_match else 'Unknown'
            
            # Parse token usage
            token_match = re.search(r'(\d+k/\d+k \(\d+%\))', clawdbot_status)
            token_usage = token_match.group(1) if token_match else 'Unknown'
            
            # Check gateway status
            if 'running' in clawdbot_status.lower():
                gateway_status = "✅ Running"
            else:
                gateway_status = "🔴 Stopped"
                
        except:
            session_count = 0
            current_model = "Unknown"
            token_usage = "Unknown"
            gateway_status = "❓ Unknown"
        
        data.update({
            'llm': {
                'sessions': session_count,
                'model': current_model,
                'tokens': token_usage
            },
            'system': {
                'gateway': gateway_status,
                'memory': memory_info,
                'uptime': uptime
            },
            'timestamp': datetime.now().isoformat()
        })
        
        return data
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

def run_server(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, DashboardAPI)
    print(f"🚀 Dashboard server running at http://localhost:{port}")
    print(f"📊 System dashboard: http://localhost:{port}/")
    print(f"🔧 API endpoint: http://localhost:{port}/api/system-status")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run_server(port)