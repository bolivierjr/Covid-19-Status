import { Container } from 'typedi';
import express from 'express';
import loaders from './loaders';
import config from './config';
import api from './api';

async function startServer() {
  const app = express();

  await loaders();
  await api(app);

  const logger = Container.get('logger');

  const server = app
    .listen(config.port, () => {
      logger.info(`Server listening on port ${config.port} in ${config.env} mode...`);
    })
    .on('error', err => {
      logger.error(`${err}. Exiting...`);
      process.exitCode = 1;
    });

  const startGracefulShutdown = () => {
    logger.warn('Starting shutdown of the server...');

    server.close(() => {
      logger.warn('Express server shut down.');
      process.exitCode = 0;
    });
  };

  process.on('SIGTERM', startGracefulShutdown);
  process.on('SIGINT', startGracefulShutdown);
}

startServer();
