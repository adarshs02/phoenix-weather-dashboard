-- Create tables for Phoenix Heat & Air-Quality Dashboard

-- Source table: stores data source information (NWS, AirNow)
CREATE TABLE IF NOT EXISTS source (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    api_endpoint TEXT
);

-- Station table: stores monitoring station locations
CREATE TABLE IF NOT EXISTS station (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100) UNIQUE,
    name VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    source_id INTEGER REFERENCES source(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Variable table: stores types of measurements (Temperature, AQI, etc.)
CREATE TABLE IF NOT EXISTS variable (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    unit VARCHAR(50) NOT NULL
);

-- Reading table: stores time-stamped measurements
CREATE TABLE IF NOT EXISTS reading (
    id SERIAL PRIMARY KEY,
    station_id INTEGER NOT NULL REFERENCES station(id) ON DELETE CASCADE,
    variable_id INTEGER NOT NULL REFERENCES variable(id) ON DELETE CASCADE,
    observed_at TIMESTAMP NOT NULL,
    value_num DECIMAL(10, 2),
    value_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(station_id, variable_id, observed_at)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_reading_station_variable ON reading(station_id, variable_id);
CREATE INDEX IF NOT EXISTS idx_reading_observed_at ON reading(observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_latest ON reading(station_id, variable_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_station_location ON station(latitude, longitude);
