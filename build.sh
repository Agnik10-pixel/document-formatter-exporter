#!/bin/bash
set -e

echo "Installing frontend dependencies..."
cd frontend
npm ci --omit=dev

echo "Building frontend..."
npm run build

echo "Build completed successfully!"
