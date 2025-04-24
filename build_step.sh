#!/bin/bash

# Exit immediately on error
set -e

echo "📦 Installing frontend dependencies..."
cd bloglist-frontend
npm install

echo "🔨 Building frontend..."
npm run build

echo "📁 Moving build to backend dist/"
cd ..
rm -rf dist
mkdir -p dist
cp -r bloglist-frontend/dist/* dist/


echo "📦 Installing backend dependencies..."
npm install

echo "✅ Full build complete"
