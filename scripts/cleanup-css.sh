#!/bin/bash

# Post-build CSS cleanup script
# This script strips unwanted CSS rules from the build output

BUILD_DIR="dist/assets"

echo "Starting CSS cleanup..."

# Find all CSS files in the build directory
if [ -d "$BUILD_DIR" ]; then
  for css_file in "$BUILD_DIR"/*.css; do
    if [ -f "$css_file" ]; then
      echo "Processing: $css_file"
      
      # Remove all occurrences of fill-primary rules using sed
      # This removes the rule and its value (e.g., .fill-primary{fill:#adb8ed})
      sed -i -E 's/\.fill-[a-zA-Z0-9-]+\{[^}]*\}//g' "$css_file"
      
      # Remove any standalone fill utilities
      sed -i -E 's/\.fill-[a-zA-Z0-9-]+[,\s]*//g' "$css_file"
      
      echo "Cleaned: $css_file"
    fi
  done
  echo "CSS cleanup completed!"
else
  echo "Build directory not found: $BUILD_DIR"
  exit 1
fi
