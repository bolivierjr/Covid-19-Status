import { Container } from 'typedi';
import express from 'express';
import loaders from './loaders';
import config from './config';
import api from './api';

async function startServer() {
  const app = express();

  await loaders();
  await api(app);

  app.listen(config.port, err => {
    const logger = Container.get('logger');

    if (err) {
      logger.error(err);
      logger.error('Exiting...');
      process.exit(1);
    }

    logger.info(`Server listening on port: ${config.port} in ${config.env} mode...`);
  });
}

startServer();
