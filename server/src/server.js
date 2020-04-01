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

  const server = app.listen(config.port, err => {
    if (err) {
      logger.error(err);
      logger.error('Exiting...');
      process.exitCode = 1;
    }

    logger.info(`Server listening on port: ${config.port} in ${config.env} mode...`);
  });

  const startGraceFulShutdown = () => {
    logger.warn('Starting shutdown of the server...');

    server.close(() => {
      logger.warn('Express server shut down.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', startGraceFulShutdown);
  process.on('SIGINT', startGraceFulShutdown);
}

startServer();
