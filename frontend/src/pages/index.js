import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { fetchLatestReadings } from '../lib/api';
import StationList from '../components/StationList';
import styles from '../styles/Home.module.css';

// Import Map dynamically to avoid SSR issues with Leaflet
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading map...</div>
});

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    loadData();
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const readings = await fetchLatestReadings();
      setData(readings);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load data. Please check if the backend API is running.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
    // Call the map's flyTo method
    if (mapRef.current && mapRef.current.flyToStation) {
      mapRef.current.flyToStation(station.latitude, station.longitude);
    }
  };

  return (
    <>
      <Head>
        <title>Phoenix Heat & Air-Quality Dashboard</title>
        <meta name="description" content="Real-time heat and air quality monitoring for Phoenix, AZ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>Phoenix Heat & Air-Quality Dashboard</h1>
              <p className={styles.subtitle}>
                Real-time monitoring | Data sources: NWS &amp; AirNow
              </p>
            </div>

            <div className={styles.headerControls}>
              {lastUpdated && (
                <div className={styles.lastUpdated}>
                  <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                  <button onClick={loadData} className={styles.refreshButton}>
                    Refresh
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {loading && <div className={styles.loading}>Loading data...</div>}

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
              <StationList
                data={data}
                onStationClick={handleStationClick}
                selectedStation={selectedStation}
              />
            </aside>

            <section className={styles.mapContainer}>
              <Map
                ref={mapRef}
                data={data}
                onMarkerClick={handleStationClick}
              />
            </section>
          </div>
        )}
      </main>
    </>
  );
}
