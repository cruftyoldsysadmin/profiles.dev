#!/bin/bash

# Build script for profiles.dev GitHub Action

echo "Building profiles.dev GitHub Action..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the action
echo "Building with ncc..."
npm run build

echo "Build complete! The action is ready to use."
echo "Next steps:"
echo "1. Push to GitHub repository at https://github.com/nomadops/profiles.dev"
echo "2. Create a release tag (e.g., v1.0.0)"
echo "3. Publish to GitHub Marketplace"