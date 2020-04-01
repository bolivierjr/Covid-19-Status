// Set NODE_ENV to development by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  loglevel: process.env.LOG_LEVEL || 'info',
};
