const NWSClient = require('./nws-client');
const AirNowClient = require('./airnow-client');
const Station = require('../models/station');
const Variable = require('../models/variable');
const Reading = require('../models/reading');

class ETLService {
  constructor() {
    this.nwsClient = new NWSClient();
    this.airNowClient = new AirNowClient(process.env.AIRNOW_API_KEY);
  }

  async runETL() {
    console.log('Starting ETL job...');
    const startTime = Date.now();

    try {
      // Fetch all stations from database
      const stations = await Station.getAll();
      console.log(`Found ${stations.length} stations to process`);

      // Fetch all variables for mapping
      const variables = await Variable.getAll();
      const variableMap = {};
      variables.forEach(v => {
        variableMap[v.code] = v.id;
      });

      // Process stations in parallel (batches of 5 to respect rate limits)
      const batchSize = 5;
      for (let i = 0; i < stations.length; i += batchSize) {
        const batch = stations.slice(i, i + batchSize);
        await Promise.all(batch.map(station =>
          this.processStation(station, variableMap)
            .catch(error => console.error(`Error processing station ${station.name}:`, error.message))
        ));
      }

      const duration = Date.now() - startTime;
      console.log(`ETL job completed in ${duration}ms`);
    } catch (error) {
      console.error('ETL job failed:', error);
      throw error;
    }
  }

  async processStation(station, variableMap) {
    console.log(`Processing ${station.name}...`);

    // Fetch temperature data using lat/lon (works for all stations)
    await this.fetchTemperatureData(station, variableMap);

    // Fetch AQI data for all stations (using zip or lat/lon)
    await this.fetchAQIData(station, variableMap);
  }

  async fetchTemperatureData(station, variableMap) {
    try {
      // Use lat/lon method for all stations
      const observations = await this.nwsClient.getObservationsByLatLon(
        parseFloat(station.latitude),
        parseFloat(station.longitude)
      );

      if (!observations) {
        console.log(`  No temperature data available`);
        return;
      }

      // Store temperature reading
      if (observations.temperature !== null && variableMap['TEMP']) {
        await Reading.upsert(
          station.id,
          variableMap['TEMP'],
          observations.timestamp,
          observations.temperature
        );
        console.log(`  ✓ Temperature: ${observations.temperature.toFixed(1)}°F`);
      }

      // Store heat index reading
      if (observations.heatIndex !== null && variableMap['HEAT_INDEX']) {
        await Reading.upsert(
          station.id,
          variableMap['HEAT_INDEX'],
          observations.timestamp,
          observations.heatIndex
        );
        console.log(`  ✓ Heat Index: ${observations.heatIndex.toFixed(1)}°F`);
      }
    } catch (error) {
      console.log(`  ✗ Temperature fetch failed: ${error.message}`);
    }
  }

  async fetchAQIData(station, variableMap) {
    try {
      let aqiData = null;

      // Try zip code first if available and valid
      if (station.external_id && station.external_id.match(/^\d{5}$/)) {
        aqiData = await this.airNowClient.getCurrentAQIByZipCode(station.external_id);
      }

      // Fallback to lat/lon if no zip code or if zip fetch failed/returned no data
      if (!aqiData) {
        aqiData = await this.airNowClient.getCurrentAQI(
          parseFloat(station.latitude),
          parseFloat(station.longitude)
        );
      }

      if (!aqiData) {
        console.log(`  No AQI data available`);
        return;
      }

      // Store AQI reading
      if (aqiData.aqi !== null && variableMap['AQI']) {
        await Reading.upsert(
          station.id,
          variableMap['AQI'],
          aqiData.timestamp,
          aqiData.aqi,
          aqiData.category
        );
        console.log(`  ✓ AQI: ${aqiData.aqi} (${aqiData.category})`);
      }
    } catch (error) {
      console.log(`  ✗ AQI fetch failed: ${error.message}`);
    }
  }
}

// Export a singleton instance
const etlService = new ETLService();

module.exports = {
  runETL: () => etlService.runETL()
};
