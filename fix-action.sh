#!/bin/bash

echo "Fixing action setup..."

# Navigate to action directory and generate package-lock.json
cd action
npm install
cd ..

# Also need to fix the user workflow to not use the action yet
sed -i '' 's/uses: nomadops\/profiles.dev@v1/uses: .\/  # Will use nomadops\/profiles.dev@v1 after testing/' .github/workflows/update-profile.yml

echo "Done! Now commit and push the fixes."