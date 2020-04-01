import DInjectorLoader from './injector';
import MongooseLoader from './mongoose';
import Logger from './logger';

export default async () => {
  await DInjectorLoader();
  Logger.info('Dependency Injector Loaded!');

  await MongooseLoader();
  Logger.info('Mongoose Connection Loaded!');
};
