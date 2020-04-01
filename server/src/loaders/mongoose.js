import { Container } from 'typedi';
import mongooose from 'mongoose';
import config from '../config';

export default async () => {
  const logger = Container.get('logger');

  try {
    await mongooose.connect(config.dbUrl, { useNewUrlParser: true });
  } catch (err) {
    logger.error(`src.loaders.mongoose.connection.failed: ${err}`);
  }

  mongooose.connection.on('error', err => {
    logger.error(`src.loaders.mongoose: ${err}`);
  });
};