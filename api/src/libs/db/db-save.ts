import * as fs from 'fs';

import { DbRecord_2022_07_16 } from './db-record';

export function dbSaveGeneric<T>(records: T[], handle: string) {
  if (!records.length) console.warn('saving empty record set');

  //console.log(`saving ${handle}`);
  fs.writeFile(
    handle,
    JSON.stringify(records, null, '  '),
    function (err: any) {
      if (err) {
        return console.error(err);
      }
    },
  );
}

export const dbSave = (records: DbRecord_2022_07_16[], handle: string) =>
  dbSaveGeneric<DbRecord_2022_07_16>(records, handle);

export default dbSave;
