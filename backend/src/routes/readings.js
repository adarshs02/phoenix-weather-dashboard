const express = require('express');
const router = express.Router();
const Reading = require('../models/reading');

// GET /api/latest - Get latest readings for all stations
router.get('/latest', async (req, res) => {
  try {
    const readings = await Reading.getLatest();

    // Group readings by station for easier frontend consumption
    const groupedByStation = readings.reduce((acc, reading) => {
      const stationId = reading.station_id;

      if (!acc[stationId]) {
        acc[stationId] = {
          station_id: stationId,
          station_name: reading.station_name,
          latitude: parseFloat(reading.latitude),
          longitude: parseFloat(reading.longitude),
          source_name: reading.source_name,
          readings: []
        };
      }

      acc[stationId].readings.push({
        variable_code: reading.variable_code,
        variable_unit: reading.variable_unit,
        observed_at: reading.observed_at,
        value_num: reading.value_num ? parseFloat(reading.value_num) : null,
        value_text: reading.value_text
      });

      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(groupedByStation)
    });
  } catch (error) {
    console.error('Error in GET /api/latest:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest readings'
    });
  }
});

// GET /api/latest/:stationId - Get latest readings for a specific station
router.get('/latest/:stationId', async (req, res) => {
  try {
    const readings = await Reading.getLatestByStation(req.params.stationId);

    res.json({
      success: true,
      data: readings
    });
  } catch (error) {
    console.error('Error in GET /api/latest/:stationId:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest readings for station'
    });
  }
});

module.exports = router;
