const express = require('express');
const router = express.Router();
const Station = require('../models/station');

// GET /api/stations - Get all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.getAll();
    res.json({
      success: true,
      data: stations
    });
  } catch (error) {
    console.error('Error in GET /api/stations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stations'
    });
  }
});

// GET /api/stations/:id - Get station by ID
router.get('/:id', async (req, res) => {
  try {
    const station = await Station.getById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        error: 'Station not found'
      });
    }

    res.json({
      success: true,
      data: station
    });
  } catch (error) {
    console.error('Error in GET /api/stations/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch station'
    });
  }
});

module.exports = router;
