# 🔧 Database Troubleshooting Guide

## Problem: Database tidak muncul

### Step 1: Check PostgreSQL Status
\`\`\`bash
# Check if PostgreSQL is running
npm run check-db
\`\`\`

### Step 2: Start PostgreSQL (Choose one method)

#### Method A: Using Docker (Recommended)
\`\`\`bash
# Start PostgreSQL container
npm run docker:up

# Check if container is running
docker ps
\`\`\`

#### Method B: Using Local PostgreSQL
\`\`\`bash
# Start PostgreSQL service (Ubuntu/Debian)
sudo service postgresql start

# Start PostgreSQL service (macOS with Homebrew)
brew services start postgresql

# Start PostgreSQL service (Windows)
net start postgresql-x64-13
\`\`\`

### Step 3: Create Database and User
\`\`\`bash
# Create database and user
npm run create-db
\`\`\`

### Step 4: Setup Tables and Data
\`\`\`bash
# Setup tables and seed data
npm run setup-db
\`\`\`

### Step 5: Verify Setup
\`\`\`bash
# Check if everything is working
npm run check-db
\`\`\`

## Common Issues:

### 1. Connection Refused (ECONNREFUSED)
**Problem**: PostgreSQL is not running
**Solution**: 
\`\`\`bash
# Using Docker
docker-compose up -d

# Check status
docker ps
\`\`\`

### 2. Database doesn't exist (3D000)
**Problem**: Database 'pelni_booking' not created
**Solution**:
\`\`\`bash
npm run create-db
\`\`\`

### 3. Authentication failed
**Problem**: Wrong username/password
**Solution**: Check your `.env.local` file:
\`\`\`env
POSTGRES_USER=pelni_user
POSTGRES_PASSWORD=Pelni2025
POSTGRES_DB=pelni_booking
\`\`\`

### 4. Permission denied
**Problem**: User doesn't have privileges
**Solution**:
\`\`\`sql
-- Connect as superuser and run:
GRANT ALL PRIVILEGES ON DATABASE pelni_booking TO pelni_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pelni_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pelni_user;
\`\`\`

## Quick Reset (Nuclear Option)
\`\`\`bash
# Stop everything
npm run docker:down

# Remove volumes (WARNING: This deletes all data!)
docker volume rm $(docker volume ls -q)

# Start fresh
npm run docker:up
npm run db:reset
\`\`\`

## Manual Database Creation
If automated scripts don't work, create manually:

\`\`\`sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE pelni_booking;

-- Create user
CREATE USER pelni_user WITH PASSWORD 'Pelni2025';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE pelni_booking TO pelni_user;

-- Connect to the new database
\c pelni_booking;

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO pelni_user;
