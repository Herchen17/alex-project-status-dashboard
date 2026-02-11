#!/bin/bash
# Dashboard management script

ACTION=${1:-status}
PID_FILE="/home/ubuntu/clawd/logs/dashboard.pid"
LOG_FILE="/home/ubuntu/clawd/logs/dashboard.log"
DASHBOARD_PORT=${2:-8080}

case "$ACTION" in
    "status")
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if kill -0 $PID 2>/dev/null; then
                echo "✅ Dashboard server running (PID: $PID)"
                echo "📊 URL: http://localhost:$DASHBOARD_PORT/"
                echo "🔧 API: http://localhost:$DASHBOARD_PORT/api/system-status"
            else
                echo "❌ Dashboard server not running (stale PID file)"
                rm -f "$PID_FILE"
            fi
        else
            echo "❌ Dashboard server not running"
        fi
        ;;
        
    "stop")
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if kill -0 $PID 2>/dev/null; then
                kill $PID
                rm -f "$PID_FILE"
                echo "🛑 Dashboard server stopped"
            else
                echo "❌ Dashboard server not running"
                rm -f "$PID_FILE"
            fi
        else
            echo "❌ Dashboard server not running"
        fi
        
        # Also kill any python dashboard processes
        pkill -f "dashboard-server.py" 2>/dev/null && echo "🧹 Cleaned up any orphaned processes"
        ;;
        
    "restart")
        $0 stop
        sleep 2
        ~/clawd/scripts/dashboard-background.sh $DASHBOARD_PORT
        ;;
        
    "logs")
        if [ -f "$LOG_FILE" ]; then
            echo "📜 Dashboard logs (last 30 lines):"
            echo "=================================="
            tail -30 "$LOG_FILE"
        else
            echo "❌ No log file found at $LOG_FILE"
        fi
        ;;
        
    "test")
        echo "🧪 Testing dashboard API..."
        curl -s "http://localhost:$DASHBOARD_PORT/api/system-status" | python3 -m json.tool || echo "❌ API test failed"
        ;;
        
    *)
        echo "Dashboard Control Commands:"
        echo "  dashboard-status  - Check if running"
        echo "  dashboard-stop    - Stop the server"
        echo "  dashboard-restart - Restart the server"
        echo "  dashboard-logs    - View recent logs"
        echo "  dashboard-test    - Test API endpoint"
        echo
        echo "Usage: $0 {status|stop|restart|logs|test} [port]"
        ;;
esac