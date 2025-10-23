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

      // Process each station - fetch both temperature and AQI
      for (const station of stations) {
        try {
          await this.processStation(station, variableMap);
        } catch (error) {
          console.error(`Error processing station ${station.name}:`, error.message);
          // Continue with next station
        }
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

    // Fetch AQI data if station has a zip code
    if (station.external_id && station.external_id.match(/^\d{5}$/)) {
      await this.fetchAQIData(station, variableMap);
    }
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
      const aqiData = await this.airNowClient.getCurrentAQIByZipCode(station.external_id);

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
