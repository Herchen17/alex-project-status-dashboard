#!/bin/bash
# Setup system monitoring aliases and cron jobs

echo "Setting up disk monitoring system..."

# Add aliases to .bashrc for easy access
cat >> ~/.bashrc << 'EOF'

# Disk & System Monitoring Aliases
alias disk-status='~/clawd/scripts/system-status.sh'
alias disk-clean='~/clawd/scripts/disk-monitor.sh clean'
alias llm-usage='~/clawd/scripts/llm-usage.sh'
alias system-health='~/clawd/scripts/system-status.sh && echo && ~/clawd/scripts/llm-usage.sh'

# Web Dashboard Aliases
alias dashboard-start='~/clawd/scripts/dashboard-background.sh'
alias dashboard-status='~/clawd/scripts/dashboard-control.sh status'
alias dashboard-stop='~/clawd/scripts/dashboard-control.sh stop'
alias dashboard-restart='~/clawd/scripts/dashboard-control.sh restart'
alias dashboard-logs='~/clawd/scripts/dashboard-control.sh logs'
alias dashboard-test='~/clawd/scripts/dashboard-control.sh test'
EOF

# Create system cron job for disk monitoring (every 4 hours)
echo "Setting up cron job for disk monitoring..."
(crontab -l 2>/dev/null; echo "0 */4 * * * /home/ubuntu/clawd/scripts/disk-monitor.sh check") | crontab -

# Create daily cleanup cron (2 AM daily)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/clawd/scripts/disk-monitor.sh clean") | crontab -

echo "✅ Monitoring system setup complete!"
echo
echo "Available commands:"
echo "  disk-status     - Show current disk usage and system health"
echo "  disk-clean      - Force cleanup of disk space"
echo "  llm-usage       - Show LLM token usage and costs"
echo "  system-health   - Show full system dashboard"
echo
echo "Web Dashboard commands:"
echo "  dashboard-start - Start web dashboard server"
echo "  dashboard-status - Check if dashboard is running"
echo "  dashboard-stop  - Stop dashboard server"
echo "  dashboard-logs  - View dashboard logs"
echo
echo "Automated monitoring:"
echo "  • Disk check every 4 hours (auto-cleanup at 85%+)"
echo "  • Daily cleanup at 2 AM"
echo
echo "Reload shell: source ~/.bashrc"