#!/bin/bash

# Try to download logos from seeklogo using pattern matching
download_logo() {
    local name=$1
    local filename=$2
    local searchterm=$3
    
    echo "🔍 Searching seeklogo for: $name"
    
    # Try common seeklogo URL patterns
    urls=(
        "https://seeklogo.com/images/${searchterm}/${searchterm}-logo.png"
        "https://seeklogo.com/images/${searchterm}/${searchterm}.png"
    )
    
    for url in "${urls[@]}"; do
        curl -s -L -A "Mozilla/5.0" -o "$filename" "$url" 2>/dev/null
        if [ -f "$filename" ] && [ -s "$filename" ]; then
            size=$(stat -c%s "$filename" 2>/dev/null || stat -f%z "$filename" 2>/dev/null)
            if [ "$size" -gt 2000 ]; then
                echo "✓ Downloaded $name ($size bytes)"
                return 0
            fi
        fi
        rm -f "$filename"
    done
    
    echo "✗ Could not find $name on seeklogo"
    return 1
}

# Try downloading several logos
download_logo "UNEP" "unep-seeklogo.png" "unep" &
download_logo "Rotary Club" "rotary-club-seeklogo.png" "rotary-club" &
download_logo "SuperSport" "supersport-seeklogo.png" "supersport" &
download_logo "TIFA Trust" "tifa-seeklogo.png" "tifa" &
download_logo "GCPEA" "gcpea-seeklogo.png" "gcpea" &
download_logo "Housefarm" "housefarm-seeklogo.png" "housefarm" &

wait
echo ""
echo "Download attempt complete. Check for results above."
ls -lh *-seeklogo.png 2>/dev/null | wc -l
