const axios = require('axios');

class AirNowClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://www.airnowapi.org/aq';
  }

  async getCurrentAQI(latitude, longitude) {
    if (!this.apiKey || this.apiKey === 'your_airnow_api_key_here') {
      console.warn('AirNow API key not configured, skipping AQI fetch');
      return null;
    }

    try {
      const url = `${this.baseURL}/observation/latLong/current/`;
      const params = {
        format: 'application/json',
        latitude: latitude,
        longitude: longitude,
        distance: 25, // Search within 25 miles
        API_KEY: this.apiKey
      };

      const response = await axios.get(url, { params });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      // Find the overall AQI (usually the highest of all pollutants)
      const aqiData = response.data.reduce((max, current) => {
        return (current.AQI > max.AQI) ? current : max;
      }, response.data[0]);

      return {
        aqi: aqiData.AQI,
        category: aqiData.Category.Name,
        parameterName: aqiData.ParameterName,
        timestamp: aqiData.DateObserved + 'T' + aqiData.HourObserved + ':00:00Z'
      };
    } catch (error) {
      console.error(`Error fetching AirNow data for ${latitude},${longitude}:`, error.message);
      return null;
    }
  }

  async getCurrentAQIByZipCode(zipCode) {
    if (!this.apiKey || this.apiKey === 'your_airnow_api_key_here') {
      console.warn('AirNow API key not configured, skipping AQI fetch');
      return null;
    }

    try {
      const url = `${this.baseURL}/observation/zipCode/current/`;
      const params = {
        format: 'application/json',
        zipCode: zipCode,
        distance: 25,
        API_KEY: this.apiKey
      };

      const response = await axios.get(url, { params });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      // Find the overall AQI
      const aqiData = response.data.reduce((max, current) => {
        return (current.AQI > max.AQI) ? current : max;
      }, response.data[0]);

      return {
        aqi: aqiData.AQI,
        category: aqiData.Category.Name,
        parameterName: aqiData.ParameterName,
        timestamp: aqiData.DateObserved + 'T' + aqiData.HourObserved + ':00:00Z',
        reportingArea: aqiData.ReportingArea
      };
    } catch (error) {
      console.error(`Error fetching AirNow data for zip ${zipCode}:`, error.message);
      return null;
    }
  }
}

module.exports = AirNowClient;
