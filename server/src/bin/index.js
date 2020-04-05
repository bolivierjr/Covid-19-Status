import update from './updateData';
import Logger from '../loaders/logger';

const [arg] = process.argv.slice(2);
if (arg && arg !== '--fetchAll') {
  Logger.error('Incorrect argument. Optional Args: --fetchAll');
  process.exit(1);
}

update.getData(arg).then(data => {
  update.storeData(data);
});
