import * as fs from 'fs';

import { DbRecord } from './db-record';

const dbSave = (records: DbRecord[], handle: string) => {
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
};

export default dbSave;
