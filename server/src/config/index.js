// Set NODE_ENV to development by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.NODE_PORT, 10) || 5000,
  loglevel: process.env.LOG_LEVEL || 'info',
  dbUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/reports',
};
