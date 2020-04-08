import { createConnection } from 'typeorm';
import path from 'path';
import config from '../config';

export default async () => {
  try {
    await createConnection({
      type: 'postgres',
      url: config.dbUrl,
      entities: [path.join(__dirname, '../models/*.js')],
    });
  } catch (err) {
    throw new Error(`src.loaders.postgres.connection.failed: ${err}`);
  }
};
