#!/bin/bash
# Run dashboard in background with proper logging

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_PORT=${1:-8080}
LOG_FILE="/home/ubuntu/clawd/logs/dashboard.log"

# Create logs directory
mkdir -p /home/ubuntu/clawd/logs

# Kill any existing dashboard server
pkill -f "dashboard-server.py" 2>/dev/null || true

echo "🚀 Starting dashboard server in background..."
echo "Port: $DASHBOARD_PORT"
echo "Logs: $LOG_FILE"

# Start server in background
cd /home/ubuntu/clawd
nohup python3 "$SCRIPT_DIR/dashboard-server.py" $DASHBOARD_PORT > "$LOG_FILE" 2>&1 &
DASHBOARD_PID=$!

# Give it a moment to start
sleep 2

# Check if it started successfully
if kill -0 $DASHBOARD_PID 2>/dev/null; then
    echo "✅ Dashboard server started (PID: $DASHBOARD_PID)"
    echo "📊 Dashboard URL: http://localhost:$DASHBOARD_PORT/"
    echo "🔧 API URL: http://localhost:$DASHBOARD_PORT/api/system-status"
    echo
    echo "Management commands:"
    echo "  dashboard-status   - Check if running"
    echo "  dashboard-stop     - Stop the server"
    echo "  dashboard-logs     - View logs"
    
    # Save PID for management
    echo $DASHBOARD_PID > /home/ubuntu/clawd/logs/dashboard.pid
else
    echo "❌ Failed to start dashboard server"
    echo "Check logs: tail $LOG_FILE"
    exit 1
fi