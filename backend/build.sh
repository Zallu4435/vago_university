#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting build process..."

# Clean previous build (cross-platform)
echo "🧹 Cleaning previous build..."
rm -rf dist 2>/dev/null || rmdir /s /q dist 2>/dev/null || true

# Check if TypeScript is available
echo "📦 Checking TypeScript installation..."
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found, installing dependencies..."
    npm install
fi

# Show current directory and files
echo "📁 Current directory: $(pwd)"
echo "📁 Files in current directory:"
ls -la

# Build with TypeScript
echo "🔨 Building TypeScript..."
npx tsc --project tsconfig.json --noEmitOnError false

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Files in dist directory:"
    ls -la dist/
    
    # Check if server.js exists
    if [ -f "dist/server.js" ]; then
        echo "✅ server.js found!"
    else
        echo "❌ server.js not found in dist directory!"
        echo "📁 Contents of dist:"
        find dist -type f -name "*.js" | head -10
        exit 1
    fi
else
    echo "❌ Build failed - dist directory not created!"
    echo "🔍 Trying to compile with verbose output..."
    npx tsc --project tsconfig.json --noEmitOnError false --listFiles
    exit 1
fi

echo "🎉 Build process completed successfully!" 