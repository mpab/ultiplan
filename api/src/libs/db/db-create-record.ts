import fs from 'fs';

import { DbRecord } from './db-record';

import dbLoad from './db-load';
import dbSave from './db-save';

// TODO: multi-record update is not working

const dbCreateRecord = (new_record: DbRecord, handle: string) => {
  // validate item
  let item_errors = '';

  if (!new_record.id) {
    item_errors += 'no id, ';
  }

  if (!new_record.description) {
    item_errors += 'no description, ';
  }

  if (!new_record.created_on) {
    item_errors += 'no created_on, ';
  }

  if (item_errors.length) {
    return console.error(item_errors);
  }

  const records: DbRecord[] = dbLoad(handle);
  records.push(new_record);
  //console.log(`adding ${new_record.description}`);
  dbSave(records, handle);
};

export default dbCreateRecord;
