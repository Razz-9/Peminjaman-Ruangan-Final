#!/bin/bash

echo "🚀 Manual Database Setup"
echo "======================="

# Check if PostgreSQL is running
echo "1. Checking PostgreSQL connection..."
if pg_isready -h localhost -p 5432 -U pelni_user; then
    echo "✅ PostgreSQL is running"
else
    echo "❌ PostgreSQL is not running or not accessible"
    echo "Please start PostgreSQL first:"
    echo "  - Using Docker: docker-compose up -d"
    echo "  - Using local install: sudo service postgresql start"
    exit 1
fi

# Create database if it doesn't exist
echo "2. Creating database..."
createdb -h localhost -p 5432 -U pelni_user pelni_booking 2>/dev/null || echo "Database might already exist"

# Run setup script
echo "3. Running setup script..."
npm run setup-db

echo "✅ Setup complete!"
