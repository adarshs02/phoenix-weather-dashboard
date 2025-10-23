import styles from '../styles/StationList.module.css';

export default function StationList({ data, onStationClick, selectedStation }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.sidebar}>
        <h2 className={styles.title}>Areas</h2>
        <p className={styles.noData}>No stations available</p>
      </div>
    );
  }

  // Get temperature from readings
  const getTemp = (station) => {
    if (!station.readings || station.readings.length === 0) return null;
    const tempReading = station.readings.find(r => r.variable_code === 'TEMP' || r.variable_code === 'HEAT_INDEX');
    return tempReading ? tempReading.value_num : null;
  };

  // Get AQI from readings
  const getAQI = (station) => {
    if (!station.readings || station.readings.length === 0) return null;
    const aqiReading = station.readings.find(r => r.variable_code === 'AQI');
    return aqiReading ? aqiReading.value_num : null;
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Phoenix Areas</h2>
      <div className={styles.stationList}>
        {data.map(station => {
          const temp = getTemp(station);
          const aqi = getAQI(station);
          const isSelected = selectedStation && selectedStation.station_id === station.station_id;

          return (
            <div
              key={station.station_id}
              className={`${styles.stationItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => onStationClick && onStationClick(station)}
            >
              <div className={styles.stationHeader}>
                <h3 className={styles.stationName}>{station.station_name}</h3>
              </div>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.label}>Temp:</span>
                  <span className={styles.value}>
                    {temp !== null ? `${temp.toFixed(1)}°F` : 'N/A'}
                  </span>
                </div>

                <div className={styles.metric}>
                  <span className={styles.label}>AQI:</span>
                  <span className={`${styles.value} ${getAQIColorClass(aqi)}`}>
                    {aqi !== null ? Math.round(aqi) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getAQIColorClass(aqi) {
  if (aqi === null) return '';
  if (aqi <= 50) return 'aqi-good';
  if (aqi <= 100) return 'aqi-moderate';
  if (aqi <= 150) return 'aqi-unhealthy-sensitive';
  if (aqi <= 200) return 'aqi-unhealthy';
  if (aqi <= 300) return 'aqi-very-unhealthy';
  return 'aqi-hazardous';
}
