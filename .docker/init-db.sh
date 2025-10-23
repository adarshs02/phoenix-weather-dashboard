#!/bin/bash
set -e

echo "Initializing database schema..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/001_create_schema.sql

echo "Seeding initial data..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/001_seed_initial_data.sql

echo "Database initialization completed!"
