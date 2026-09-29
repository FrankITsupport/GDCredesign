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
    return 1
}

# More organizations
download_logo "AfDB" "afdb-seeklogo.png" "african-development-bank" &
download_logo "WWF" "wwf-seeklogo.png" "wwf" &
download_logo "Buzz" "buzz-seeklogo.png" "buzz" &
download_logo "NSSF" "nssf-seeklogo.png" "nssf" &
download_logo "IEA" "iea-seeklogo.png" "international-energy-agency" &
download_logo "P&G" "pandg-seeklogo.png" "procter-gamble" &
download_logo "SWIFT" "swift-seeklogo.png" "swift" &
download_logo "KETRACO" "ketraco-seeklogo.png" "ketraco" &

wait
echo ""
ls -1 *-seeklogo.png 2>/dev/null | wc -l
echo "logos downloaded"
