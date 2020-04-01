import mongooose from 'mongoose';
import config from '../config';

export default async () => {
  await mongooose.connect(config.dbUrl, { useNewUrlParser: true });
};
