# Frontend Documentation

Next.js React application for the Phoenix Heat & Air-Quality Dashboard.

## Features

- Interactive Leaflet map with station markers
- Grid view of all monitoring stations
- Real-time data updates every 5 minutes
- Color-coded AQI values following EPA standards
- Responsive design for desktop and mobile
- Server-side rendering with Next.js

## Installation

```bash
npm install
```

## Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running

### Development mode
```bash
npm run dev
```

Access at: http://localhost:3000

### Production mode
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── components/
│   ├── Map.js              # Leaflet map component
│   └── StationList.js      # Station grid view component
├── lib/
│   └── api.js              # API client functions
├── pages/
│   ├── _app.js             # Next.js app wrapper
│   └── index.js            # Main dashboard page
└── styles/
    ├── globals.css         # Global styles
    ├── Home.module.css     # Dashboard page styles
    └── StationList.module.css  # Station list styles
```

## Components

### Map Component
- Uses Leaflet for interactive mapping
- Dynamic import to avoid SSR issues
- Clickable markers with popups showing station data
- Auto-fits bounds to show all stations
- Custom marker icons and popups

### StationList Component
- Grid layout of station cards
- Color-coded AQI values
- Clickable cards for interaction
- Responsive grid that adapts to screen size

## API Integration

The frontend communicates with the backend API using axios:

```javascript
import { fetchStations, fetchLatestReadings } from '../lib/api';

// Fetch all stations
const stations = await fetchStations();

// Fetch latest readings
const readings = await fetchLatestReadings();
```

## Styling

- CSS Modules for component-scoped styles
- Global styles in `globals.css`
- Responsive design with CSS Grid and Flexbox
- Color scheme following modern design principles

### AQI Color Coding

Following EPA standards:
- 0-50: Green (Good)
- 51-100: Yellow (Moderate)
- 101-150: Orange (Unhealthy for Sensitive Groups)
- 151-200: Red (Unhealthy)
- 201-300: Purple (Very Unhealthy)
- 301+: Maroon (Hazardous)

## Development

### Adding New Components

1. Create component in `src/components/`
2. Create associated CSS module in `src/styles/`
3. Import and use in pages

### Modifying API Calls

Edit `src/lib/api.js` to add new endpoints or modify existing ones.

### Customizing Styles

Edit CSS modules in `src/styles/` for component-specific styles.
Edit `globals.css` for app-wide style changes.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

## Deployment

The application can be deployed to:
- Vercel (recommended for Next.js)
- Docker container (see Dockerfile.frontend)
- Any Node.js hosting platform

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable to your production API URL.
