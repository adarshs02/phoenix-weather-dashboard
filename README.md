# Phoenix Heat & Air-Quality Dashboard

A real-time monitoring dashboard that integrates open public data from the National Weather Service (NWS) and AirNow API to display current heat and air quality levels across the Phoenix metropolitan area.

**Group 45:** Adarsh Srinivasan, Edwin Huang, Pavan Manjunath

## Project Overview

This application periodically fetches temperature/heat-index data from the National Weather Service and Air Quality Index (AQI) data from AirNow, normalizes them into a common format, and presents them through an interactive map and list view. Users can quickly understand current environmental conditions across different Phoenix neighborhoods.

### Features

- **Real-time Data Integration**: Automatic ETL job runs every 15 minutes to fetch latest data
- **Interactive Map**: Leaflet-powered map with clickable markers showing station details
- **Temperature Color-Coding**: Map markers are color-coded based on temperature (blue for cool, red for hot) with temperature displayed on each marker
- **Neighborhood Coverage**: 23+ monitoring stations across Phoenix metro area including Tempe, Scottsdale, Mesa, Glendale, Chandler, and more
- **Temperature Legend**: Visual guide showing what each color represents
- **List View**: Compact grid view of all monitoring stations with current readings
- **Color-coded AQI**: Visual indication of air quality levels following EPA standards
- **Multiple Data Sources**: Integrates NWS weather stations and AirNow monitoring sites
- **Responsive Design**: Clean, modern UI that works on desktop and mobile devices

## Architecture

### Technology Stack

- **Database**: PostgreSQL 15
- **Backend**: Node.js with Express
- **Frontend**: Next.js (React) with Leaflet for maps
- **Deployment**: Docker Compose for containerization

### Database Schema

The application uses four main tables:

1. **source**: Data source information (NWS, AirNow)
2. **station**: Monitoring station locations with coordinates
3. **variable**: Types of measurements (Temperature, Heat Index, AQI)
4. **reading**: Time-stamped measurements with station-variable relationships

See the ER diagram in the project proposal for detailed relationships.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- AirNow API key (optional but recommended) - [Request here](https://docs.airnowapi.org/account/request/)

### Quick Start with Docker

1. **Clone or navigate to the project directory**

```bash
cd /Users/adarsh/myProjects/412
```

2. **Configure environment variables**

Edit the `.env` file and add your AirNow API key:

```bash
AIRNOW_API_KEY=your_actual_api_key_here
ETL_INTERVAL_MINUTES=15
```

3. **Build and start all services**

```bash
docker-compose up --build
```

This will:
- Build the PostgreSQL database with schema and seed data
- Start the backend API server on port 3001
- Start the frontend web application on port 3100
- Run the initial ETL job to fetch data
- Schedule periodic ETL jobs every 15 minutes

4. **Access the application**

- **Frontend Dashboard**: http://localhost:3100
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

### Manual Setup (Without Docker)

<details>
<summary>Click to expand manual setup instructions</summary>

#### Database Setup

1. Install PostgreSQL 15 or higher
2. Create database:
```bash
createdb phoenix_dashboard
```

3. Run migrations:
```bash
psql -d phoenix_dashboard -f database/migrations/001_create_schema.sql
psql -d phoenix_dashboard -f database/seeds/001_seed_initial_data.sql
```

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` with your database credentials and API keys

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

5. Start the development server:
```bash
npm run dev
```

For production build:
```bash
npm run build
npm start
```

</details>

## API Documentation

### Endpoints

#### GET /api/stations
Returns all monitoring stations with their locations.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "external_id": "KPHX",
      "name": "Phoenix Sky Harbor Airport",
      "latitude": "33.4484000",
      "longitude": "-112.0740000",
      "source_name": "National Weather Service"
    }
  ]
}
```

#### GET /api/readings/latest
Returns the latest readings for all stations, grouped by station.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "station_id": 1,
      "station_name": "Phoenix Sky Harbor Airport",
      "latitude": 33.4484,
      "longitude": -112.074,
      "source_name": "National Weather Service",
      "readings": [
        {
          "variable_code": "TEMP",
          "variable_unit": "°F",
          "observed_at": "2025-10-22T19:00:00Z",
          "value_num": 85.3,
          "value_text": null
        }
      ]
    }
  ]
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Phoenix Dashboard API is running",
  "timestamp": "2025-10-22T19:30:00.000Z"
}
```

## Project Structure

```
412/
├── .docker/                    # Docker configuration files
│   ├── Dockerfile.db
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── init-db.sh
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # Data models (Station, Reading, Variable)
│   │   ├── routes/            # API routes
│   │   ├── services/          # ETL and API clients (NWS, AirNow)
│   │   └── index.js           # Main server file
│   ├── package.json
│   └── .env.example
├── database/                   # Database files
│   ├── migrations/            # SQL schema files
│   └── seeds/                 # Initial data
├── frontend/                   # Next.js React application
│   ├── src/
│   │   ├── components/        # React components (Map, StationList)
│   │   ├── lib/               # API client
│   │   ├── pages/             # Next.js pages
│   │   └── styles/            # CSS modules
│   ├── package.json
│   └── next.config.js
├── docker-compose.yml          # Docker orchestration
├── .env                        # Environment variables
├── .gitignore
└── README.md
```

## Development

### Running ETL Manually

To manually trigger the ETL job:

```bash
docker-compose exec api npm run etl
```

Or without Docker:
```bash
cd backend
npm run etl
```

### Monitoring Logs

View logs for all services:
```bash
docker-compose logs -f
```

View logs for specific service:
```bash
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

### Stopping Services

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## Configuration

### Environment Variables

#### Backend (.env or docker-compose.yml)
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (default: phoenix_dashboard)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password
- `PORT`: API server port (default: 3001)
- `AIRNOW_API_KEY`: AirNow API key for AQI data
- `ETL_INTERVAL_MINUTES`: Minutes between ETL runs (default: 15)

#### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001)

## Data Sources

### National Weather Service (NWS)
- **API**: https://api.weather.gov
- **Data**: Temperature, Heat Index
- **Stations**: Phoenix area weather observation stations
- **No API key required**

### AirNow
- **API**: https://www.airnowapi.org
- **Data**: Air Quality Index (AQI)
- **Requires API key**: [Request here](https://docs.airnowapi.org/account/request/)
- **Free tier**: Up to 500 requests per hour

## Troubleshooting

### Common Issues

**Issue**: Frontend shows "Failed to load data"
- **Solution**: Ensure backend API is running and accessible at the configured URL
- Check backend logs: `docker-compose logs -f api`

**Issue**: No AQI data appearing
- **Solution**: Verify AirNow API key is correctly set in `.env`
- Check backend logs for API errors

**Issue**: Database connection errors
- **Solution**: Wait for database to fully initialize (check with `docker-compose logs db`)
- Ensure database credentials match between services

**Issue**: Port already in use
- **Solution**: Stop any services running on ports 3000, 3001, or 5432
- Or modify port mappings in docker-compose.yml

## Contributing

This is an academic project for CSE 412. For questions or issues, contact any team member.

## License

MIT License - Academic project for educational purposes.

## Acknowledgments

- National Weather Service for providing free weather data API
- AirNow for air quality monitoring data
- OpenStreetMap contributors for map tiles
- Leaflet for the mapping library

## Presentation

[View Project Presentation](https://youtu.be/22lQBusCnyU)
