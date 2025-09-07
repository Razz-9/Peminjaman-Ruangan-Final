-- This file will be executed when the container starts for the first time

-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE pelni_booking'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pelni_booking');

-- Connect to the database
\c pelni_booking;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The rest will be handled by our setup script
