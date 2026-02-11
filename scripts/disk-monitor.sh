#!/bin/bash
# Disk Space Monitor & Cleaner for Clawdbot

set -e

THRESHOLD=90
CLEANUP_THRESHOLD=85
LOG_FILE="/home/ubuntu/disk-monitor.log"

# Function to get disk usage percentage
get_disk_usage() {
    df / | awk 'NR==2 {print $5}' | sed 's/%//'
}

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to cleanup old files
cleanup() {
    log "Starting cleanup - disk at ${1}%"
    
    # Clean package cache
    if command -v apt &> /dev/null; then
        sudo apt autoremove -y &>/dev/null || true
        sudo apt autoclean &>/dev/null || true
    fi
    
    # Clean npm cache
    npm cache clean --force 2>/dev/null || true
    
    # Clean old logs
    find /var/log -name "*.log" -mtime +7 -delete 2>/dev/null || true
    find /home/ubuntu -name "*.log" -mtime +14 -delete 2>/dev/null || true
    
    # Clean Clawdbot sessions (keep last 7 days)
    find /home/ubuntu/.clawdbot -name "*.json.bak" -mtime +7 -delete 2>/dev/null || true
    
    # Clean temporary files
    find /tmp -type f -mtime +1 -delete 2>/dev/null || true
    
    AFTER=$(get_disk_usage)
    log "Cleanup complete - disk now at ${AFTER}%"
}

# Function to show detailed disk usage
show_usage() {
    echo "=== Disk Usage Report ==="
    df -h /
    echo
    echo "=== Top 10 Largest Directories ==="
    du -sh /home/ubuntu/* 2>/dev/null | sort -hr | head -10
    echo
    echo "=== Clawdbot Session Files ==="
    find /home/ubuntu/.clawdbot -name "*.json" -exec ls -lh {} \; 2>/dev/null | head -5
    echo
    echo "=== Recent Log Activity ==="
    tail -5 "$LOG_FILE" 2>/dev/null || echo "No log file yet"
}

# Main logic
USAGE=$(get_disk_usage)

case "${1:-check}" in
    "status")
        show_usage
        ;;
    "clean")
        cleanup $USAGE
        ;;
    "check")
        log "Disk usage: ${USAGE}%"
        
        if [ $USAGE -ge $THRESHOLD ]; then
            log "CRITICAL: Disk usage at ${USAGE}% - immediate cleanup needed!"
            cleanup $USAGE
        elif [ $USAGE -ge $CLEANUP_THRESHOLD ]; then
            log "WARNING: Disk usage at ${USAGE}% - performing preventive cleanup"
            cleanup $USAGE
        fi
        
        # Always show current status
        show_usage
        ;;
    *)
        echo "Usage: $0 {status|clean|check}"
        echo "  status - Show detailed disk usage"
        echo "  clean  - Force cleanup"
        echo "  check  - Check and auto-clean if needed (default)"
        ;;
esac