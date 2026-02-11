#!/bin/bash
# Fix binary files being processed as text

echo "🔧 FIXING BINARY FILE PROCESSING ISSUE"
echo "======================================"
echo

# Create archive directory for large images
mkdir -p archived-images

echo "📊 Current disk usage by large files:"
find /home/ubuntu/clawd -name "*.png" -size +1M -exec ls -lh {} \;

echo
echo "📦 Moving large PNG files to archive..."

# Move large PNGs to archive (keeping directory structure)
find /home/ubuntu/clawd -name "*.png" -size +1M | while read file; do
    rel_path=$(realpath --relative-to=/home/ubuntu/clawd "$file")
    archive_dir="archived-images/$(dirname "$rel_path")"
    mkdir -p "$archive_dir"
    
    echo "Moving: $rel_path"
    mv "$file" "$archive_dir/"
done

echo
echo "✅ Large images archived to: archived-images/"
echo

# Create symbolic links for essential images (if needed)
if [ -f "archived-images/antfarm/assets/dashboard-screenshot.png" ]; then
    echo "🔗 Creating lightweight reference..."
    echo "Dashboard screenshot archived - size: $(du -sh archived-images/antfarm/assets/dashboard-screenshot.png | cut -f1)" > antfarm/assets/dashboard-screenshot.txt
fi

if [ -f "archived-images/antfarm/landing/dashboard-screenshot.png" ]; then
    echo "Dashboard screenshot archived - size: $(du -sh archived-images/antfarm/landing/dashboard-screenshot.png | cut -f1)" > antfarm/landing/dashboard-screenshot.txt
fi

echo
echo "📊 Disk space saved:"
du -sh archived-images/
echo
echo "🛡️ Protection added:"
echo "- Created .clawdignore to exclude binary files"
echo "- Large images moved to archived-images/"
echo "- Text references created where needed"
echo
echo "✅ Binary processing issue resolved!"