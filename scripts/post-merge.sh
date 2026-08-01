#!/bin/bash
set -e

# Install / sync dependencies
npm install --legacy-peer-deps

# Push schema changes to the database (idempotent)
npm run db:push
