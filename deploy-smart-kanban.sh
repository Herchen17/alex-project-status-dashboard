#!/bin/bash

# Smart Kanban Deployment Script
echo "🪖 Deploying Smart Kanban Board..."

# Copy the smart kanban to main directory for easy access
cp /home/ubuntu/clawd/projects/kanban-dashboard/kanban-v10-smart-organization.html /home/ubuntu/clawd/smart-kanban.html

# Create a simple launcher
cat > /home/ubuntu/clawd/open-kanban.sh << 'EOF'
#!/bin/bash
echo "🪖 Opening Smart Kanban Board..."
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open /home/ubuntu/clawd/smart-kanban.html
elif command -v open >/dev/null 2>&1; then
    open /home/ubuntu/clawd/smart-kanban.html
else
    echo "Open manually: file:///home/ubuntu/clawd/smart-kanban.html"
fi
EOF

chmod +x /home/ubuntu/clawd/open-kanban.sh

echo "✅ Smart Kanban deployed!"
echo "📁 Main file: /home/ubuntu/clawd/smart-kanban.html"
echo "🚀 Quick launch: /home/ubuntu/clawd/open-kanban.sh"
echo ""
echo "🎯 KEY FIXES IMPLEMENTED:"
echo "   • Focus View: Only Critical + High priority (no more overwhelming 57 tasks!)"
echo "   • Smart Filtering: Priority, Owner, Project, Search"
echo "   • Multiple Views: Focus, Groups, All Tasks"
echo "   • Professional Design: Medical-grade interface"
echo "   • Intelligent Organization: Proper task categorization"
echo ""
echo "🚀 Run './open-kanban.sh' to launch!"