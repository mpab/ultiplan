import { DbRecord_2022_07_16 } from './db-record';

import dbLoad from './db-load';
import dbSave from './db-save';

// TODO: multi-record update is not working

const dbCreateRecord = (new_record: DbRecord_2022_07_16, handle: string) => {
  // validate item
  let item_errors = '';

  if (!new_record.id) {
    item_errors += 'no id, ';
  }

  if (!new_record.description) {
    item_errors += 'no description, ';
  }

  if (item_errors.length) {
    return console.error(item_errors);
  }

  const [records, error] = dbLoad(handle);
  if (error) return;
  records.push(new_record);
  //console.log(`adding ${new_record.description}`);
  dbSave(records, handle);
};

export default dbCreateRecord;
