import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const fetchStations = async () => {
  try {
    const response = await api.get('/api/stations');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
};

export const fetchLatestReadings = async () => {
  try {
    const response = await api.get('/api/readings/latest');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching latest readings:', error);
    throw error;
  }
};

export const fetchLatestReadingsByStation = async (stationId) => {
  try {
    const response = await api.get(`/api/readings/latest/${stationId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching latest readings by station:', error);
    throw error;
  }
};
