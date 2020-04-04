import DInjectorLoader from './injector';
import MongooseLoader from './mongoose';
import Logger from './logger';

export default async () => {
  await DInjectorLoader();
  Logger.info('Dependency Injector Loaded!');

  try {
    await MongooseLoader();
    Logger.info('Mongoose Connection Loaded!');
  } catch (err) {
    Logger.error(err.message);
  }
};
