#!/usr/bin/env bash
set -euo pipefail

echo "=== Neon Auth Astro Demo — Setup ==="

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env from .env.example — edit it with your Neon credentials"
  else
    echo "No .env or .env.example found"
    exit 1
  fi
else
  echo ".env already exists, skipping"
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "node_modules exists, skipping install"
fi

echo "=== Setup complete ==="
echo "Run 'npx astro dev' to start the dev server"
