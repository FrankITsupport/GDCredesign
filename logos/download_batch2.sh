#!/bin/bash

download_logo() {
    local name=$1
    local filename=$2
    local searchterm=$3
    
    echo "🔍 $name..."
    urls=(
        "https://seeklogo.com/images/${searchterm}/${searchterm}-logo.png"
        "https://seeklogo.com/images/${searchterm}/${searchterm}.png"
    )
    
    for url in "${urls[@]}"; do
        curl -s -L -A "Mozilla/5.0" -o "$filename" "$url" 2>/dev/null
        if [ -f "$filename" ] && [ -s "$filename" ]; then
            size=$(stat -c%s "$filename" 2>/dev/null || stat -f%z "$filename" 2>/dev/null)
            [ "$size" -gt 2000 ] && echo "✓ $name" && return 0
        fi
        rm -f "$filename" 2>/dev/null
    done
    echo "✗ $name"
    return 1
}

download_logo "Judiciary" "judiciary-seeklogo.png" "judiciary-kenya" &
download_logo "First Assurance" "first-assurance-seeklogo.png" "first-assurance" &
download_logo "EKA Hotel" "eka-hotel-seeklogo.png" "eka-hotel" &
download_logo "Kenya Vision 2030" "kenya-vision-2030-seeklogo.png" "kenya-vision-2030" &
download_logo "HKL" "hkl-seeklogo.png" "hkl" &
download_logo "LAKEFEMA" "lakefema-seeklogo.png" "lakefema" &
download_logo "Rotary International" "rotary-international-seeklogo.png" "rotary-international" &
download_logo "ISSA" "issa-seeklogo.png" "issa" &

wait
echo ""
echo "Second batch complete!"
ls -1h *-seeklogo.png 2>/dev/null | wc -l
