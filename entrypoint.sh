#!/bin/sh
set -e

# Start Nginx
echo "Starting Nginx..."
nginx

# Start Next.js as the nextjs user
echo "Starting Next.js..."
exec su-exec nextjs node server.js
