const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const stationsRouter = require('./routes/stations');
const readingsRouter = require('./routes/readings');
const { runETL } = require('./services/etl');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Phoenix Dashboard API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/stations', stationsRouter);
app.use('/api/readings', readingsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Schedule ETL job
const ETL_INTERVAL = process.env.ETL_INTERVAL_MINUTES || 15;
const cronSchedule = `*/${ETL_INTERVAL} * * * *`; // Every N minutes

console.log(`Scheduling ETL job to run every ${ETL_INTERVAL} minutes`);
cron.schedule(cronSchedule, async () => {
  console.log('Running scheduled ETL job...');
  try {
    await runETL();
    console.log('ETL job completed successfully');
  } catch (error) {
    console.error('ETL job failed:', error);
  }
});

// Run ETL on startup (optional - comment out if not desired)
console.log('Running initial ETL job...');
runETL().then(() => {
  console.log('Initial ETL completed');
}).catch((error) => {
  console.error('Initial ETL failed:', error);
});

// Start server
app.listen(PORT, () => {
  console.log(`Phoenix Dashboard API listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
