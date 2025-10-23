# Backend API Documentation

Node.js/Express REST API for the Phoenix Heat & Air-Quality Dashboard.

## Features

- RESTful API endpoints for stations and readings
- PostgreSQL database integration
- Automated ETL service for NWS and AirNow data
- Scheduled data fetching every 15 minutes
- CORS enabled for frontend integration

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=phoenix_dashboard
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
NODE_ENV=development
AIRNOW_API_KEY=your_api_key_here
ETL_INTERVAL_MINUTES=15
```

## Running

### Development mode (with auto-reload)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

### Run ETL manually
```bash
npm run etl
```

## API Endpoints

### GET /health
Health check endpoint.

### GET /api/stations
Get all monitoring stations.

### GET /api/stations/:id
Get specific station by ID.

### GET /api/readings/latest
Get latest readings for all stations.

### GET /api/readings/latest/:stationId
Get latest readings for a specific station.

## Project Structure

```
src/
├── config/
│   └── database.js         # PostgreSQL connection pool
├── models/
│   ├── station.js          # Station data model
│   ├── reading.js          # Reading data model
│   └── variable.js         # Variable data model
├── routes/
│   ├── stations.js         # Station endpoints
│   └── readings.js         # Reading endpoints
├── services/
│   ├── nws-client.js       # NWS API client
│   ├── airnow-client.js    # AirNow API client
│   └── etl.js              # ETL orchestration
└── index.js                # Main application entry
```

## ETL Process

The ETL (Extract, Transform, Load) service:

1. **Extract**: Fetches data from NWS and AirNow APIs
2. **Transform**: Normalizes data into common format
3. **Load**: Upserts readings into database

Runs automatically:
- On application startup
- Every N minutes (configured by ETL_INTERVAL_MINUTES)

## Database Models

### Station
- `getAll()`: Get all stations
- `getById(id)`: Get station by ID
- `getByExternalId(externalId)`: Get station by external ID

### Reading
- `getLatest()`: Get latest readings for all stations
- `getLatestByStation(stationId)`: Get latest readings for one station
- `upsert(...)`: Insert or update reading

### Variable
- `getAll()`: Get all variables
- `getByCode(code)`: Get variable by code

## External APIs

### National Weather Service
- Base URL: https://api.weather.gov
- Endpoints used:
  - `/stations/{stationId}/observations/latest`
- No authentication required
- Returns temperature and heat index in Celsius (converted to Fahrenheit)

### AirNow
- Base URL: https://www.airnowapi.org
- Endpoints used:
  - `/aq/observation/zipCode/current/`
  - `/aq/observation/latLong/current/`
- Requires API key
- Returns AQI values and categories

## Error Handling

- Database errors are logged and returned as 500 responses
- API client errors are logged but don't stop ETL for other stations
- Missing API keys are logged as warnings
- 404 responses for non-existent resources

## Testing

To test the API manually:

```bash
# Health check
curl http://localhost:3001/health

# Get all stations
curl http://localhost:3001/api/stations

# Get latest readings
curl http://localhost:3001/api/readings/latest
```
