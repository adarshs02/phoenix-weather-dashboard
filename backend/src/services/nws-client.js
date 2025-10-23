const axios = require('axios');

class NWSClient {
  constructor() {
    this.baseURL = 'https://api.weather.gov';
    this.headers = {
      'User-Agent': '(Phoenix Dashboard, contact@example.com)',
      'Accept': 'application/geo+json'
    };
  }

  async getObservationStations(latitude, longitude) {
    try {
      const url = `${this.baseURL}/points/${latitude},${longitude}/stations`;
      const response = await axios.get(url, { headers: this.headers });
      return response.data.features || [];
    } catch (error) {
      console.error('Error fetching NWS observation stations:', error.message);
      throw error;
    }
  }

  async getLatestObservation(stationId) {
    try {
      const url = `${this.baseURL}/stations/${stationId}/observations/latest`;
      const response = await axios.get(url, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error(`Error fetching NWS observation for ${stationId}:`, error.message);
      return null;
    }
  }

  async getObservationsByStation(stationId) {
    try {
      const url = `${this.baseURL}/stations/${stationId}/observations/latest`;
      const response = await axios.get(url, { headers: this.headers });

      const properties = response.data.properties;
      if (!properties) {
        return null;
      }

      // Extract temperature and heat index
      const observations = {
        stationId: stationId,
        timestamp: properties.timestamp,
        temperature: null,
        heatIndex: null
      };

      // Temperature in Celsius from NWS - convert to Fahrenheit
      if (properties.temperature && properties.temperature.value !== null) {
        observations.temperature = this.celsiusToFahrenheit(properties.temperature.value);
      }

      // Heat index in Celsius - convert to Fahrenheit
      if (properties.heatIndex && properties.heatIndex.value !== null) {
        observations.heatIndex = this.celsiusToFahrenheit(properties.heatIndex.value);
      }

      return observations;
    } catch (error) {
      console.error(`Error fetching observations for station ${stationId}:`, error.message);
      return null;
    }
  }

  async getObservationsByLatLon(latitude, longitude) {
    try {
      // First, get the grid point for this location
      const pointUrl = `${this.baseURL}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
      const pointResponse = await axios.get(pointUrl, { headers: this.headers });

      if (!pointResponse.data || !pointResponse.data.properties) {
        return null;
      }

      // Get the observation stations URL
      const observationStationsUrl = pointResponse.data.properties.observationStations;
      if (!observationStationsUrl) {
        return null;
      }

      // Get the nearest observation station
      const stationsResponse = await axios.get(observationStationsUrl, { headers: this.headers });

      if (!stationsResponse.data || !stationsResponse.data.features || stationsResponse.data.features.length === 0) {
        return null;
      }

      // Get the first (nearest) station
      const nearestStationUrl = stationsResponse.data.features[0].id;

      // Get latest observation from that station
      const observationUrl = `${nearestStationUrl}/observations/latest`;
      const observationResponse = await axios.get(observationUrl, { headers: this.headers });

      const properties = observationResponse.data.properties;
      if (!properties) {
        return null;
      }

      // Extract temperature and heat index
      const observations = {
        timestamp: properties.timestamp || new Date().toISOString(),
        temperature: null,
        heatIndex: null
      };

      // Temperature in Celsius from NWS - convert to Fahrenheit
      if (properties.temperature && properties.temperature.value !== null) {
        observations.temperature = this.celsiusToFahrenheit(properties.temperature.value);
      }

      // Heat index in Celsius - convert to Fahrenheit
      if (properties.heatIndex && properties.heatIndex.value !== null) {
        observations.heatIndex = this.celsiusToFahrenheit(properties.heatIndex.value);
      }

      return observations;
    } catch (error) {
      console.error(`Error fetching observations for ${latitude},${longitude}:`, error.message);
      return null;
    }
  }

  celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }
}

module.exports = NWSClient;
