#!/bin/bash
# Start the System Dashboard Server

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_PORT=${1:-8080}

echo "🚀 Starting System Dashboard Server..."
echo "Port: $DASHBOARD_PORT"
echo

# Make sure Python script is executable
chmod +x "$SCRIPT_DIR/dashboard-server.py"

# Check if port is available
if lsof -i :$DASHBOARD_PORT > /dev/null 2>&1; then
    echo "⚠️  Port $DASHBOARD_PORT is already in use!"
    echo "Current process:"
    lsof -i :$DASHBOARD_PORT
    echo
    echo "Options:"
    echo "  1. Kill existing process: sudo lsof -ti:$DASHBOARD_PORT | xargs kill -9"
    echo "  2. Use different port: $0 8081"
    exit 1
fi

# Start the dashboard server
echo "📊 Dashboard will be available at:"
echo "   http://localhost:$DASHBOARD_PORT/"
echo
echo "🔧 Commands available once running:"
echo "   curl http://localhost:$DASHBOARD_PORT/api/system-status"
echo

# Run the server
cd /home/ubuntu/clawd
python3 "$SCRIPT_DIR/dashboard-server.py" $DASHBOARD_PORT