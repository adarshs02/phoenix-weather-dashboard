-- Seed initial data for Phoenix Heat & Air-Quality Dashboard

-- Insert data sources
INSERT INTO source (name, api_endpoint) VALUES
('National Weather Service', 'https://api.weather.gov'),
('AirNow', 'https://www.airnowapi.org')
ON CONFLICT (name) DO NOTHING;

-- Insert variables
INSERT INTO variable (code, unit) VALUES
('TEMP', '°F'),
('HEAT_INDEX', '°F'),
('AQI', 'US AQI')
ON CONFLICT (code) DO NOTHING;

-- Insert Phoenix metro area monitoring stations by neighborhood/region
-- All stations will fetch temperature from NWS using lat/lon
-- Stations with zip codes will also fetch AQI from AirNow
INSERT INTO station (external_id, name, latitude, longitude, source_id) VALUES
-- Downtown & Central Phoenix
('85003', 'Downtown Phoenix', 33.4484, -112.0740, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85006', 'Central Phoenix', 33.4605, -112.0377, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85008', 'South Phoenix', 33.4255, -112.0740, (SELECT id FROM source WHERE name = 'National Weather Service')),

-- Tempe
('85281', 'Tempe - ASU Area', 33.4255, -111.9400, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85282', 'Tempe - South', 33.3942, -111.9428, (SELECT id FROM source WHERE name = 'National Weather Service')),

-- Scottsdale
('85251', 'Scottsdale - Downtown', 33.4942, -111.9261, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85254', 'Scottsdale - North', 33.6239, -111.9225, (SELECT id FROM source WHERE name = 'National Weather Service')),

-- Mesa
('85201', 'Mesa - Downtown', 33.4152, -111.8315, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85209', 'Mesa - East', 33.3789, -111.6447, (SELECT id FROM source WHERE name = 'National Weather Service')),

-- Glendale
('85301', 'Glendale - Central', 33.5387, -112.1859, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85308', 'Glendale - North', 33.6528, -112.1984, (SELECT id FROM source WHERE name = 'National Weather Service')),

-- Chandler
('85224', 'Chandler - Central', 33.3062, -111.8413, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85286', 'Chandler - East', 33.2542, -111.7293, (SELECT id FROM source WHERE name = 'National Weather Service')),

-- North Phoenix & Paradise Valley
('85023', 'North Phoenix', 33.6106, -112.0950, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85028', 'Paradise Valley', 33.5697, -111.9944, (SELECT id FROM source WHERE name = 'National Weather Service')),

-- West Phoenix
('85009', 'West Phoenix', 33.4484, -112.1340, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85037', 'Maryvale', 33.5089, -112.1773, (SELECT id FROM source WHERE name = 'National Weather Service')),

-- East Valley
('85044', 'Ahwatukee', 33.3294, -112.0131, (SELECT id FROM source WHERE name = 'National Weather Service')),
('85048', 'South Mountain', 33.3294, -111.9873, (SELECT id FROM source WHERE name = 'National Weather Service'))
ON CONFLICT (external_id) DO NOTHING;
