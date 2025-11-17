#!/bin/bash
# Exit on error
set -e

# Navigate to server directory
cd /opt/render/project/src/server

# Install dependencies
echo "Installing dependencies..."
npm install --production=false

# Build the application
echo "Building application..."
# Add any build steps if needed

echo "Build completed successfully!"
