#!/bin/bash

echo "🚀 PELNI Room Booking System - Complete Setup"
echo "============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start PostgreSQL container
echo "1. Starting PostgreSQL container..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "2. Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is ready
echo "3. Checking PostgreSQL health..."
for i in {1..30}; do
    if docker exec pelni_postgres pg_isready -U pelni_user; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

# Create database and user
echo "4. Creating database and user..."
node scripts/create-database.js

# Setup tables and data
echo "5. Setting up tables and sample data..."
node scripts/setup-database.js

# Verify setup
echo "6. Verifying setup..."
node scripts/check-database.js

echo ""
echo "🎉 Setup completed!"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev"
echo ""
echo "📝 Admin login:"
echo "   Username: admin"
echo "   Password: password"
