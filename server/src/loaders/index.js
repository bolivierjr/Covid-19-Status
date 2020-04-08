import DInjectorLoader from './injector';
import DBConnectionLoader from './dbConnection';
import Logger from './logger';

export default async () => {
  DInjectorLoader();
  Logger.info('Dependency Injector Loaded!');

  try {
    await DBConnectionLoader();
    Logger.info('TypeORM Postgres Connection Loaded!');
  } catch (err) {
    Logger.error(err.message);
  }
};
