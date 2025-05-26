#!/bin/bash

for file in *.user.js; do
    meta_file="${file/.user.js/.meta.js}"
    grep -E '^// ' "$file" > "$meta_file"
    echo "✅ Extracted metadata to: $meta_file"
done
