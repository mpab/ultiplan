// add a completed task 

import reader from "readline-sync";

import dateYYYYMMDD from "ultiplan-api/src/libs/utils/dates";
import dbCreateRecord from "ultiplan-api/src/libs/db/db-create-record";
import genGuid from "ultiplan-api/src/libs/utils/generate-uuid";
import { RecordView } from "ultiplan-api/src/libs/db/db-record";
import dbNewView from './shared/new-view';
import { RecordDates, recordFromView } from "ultiplan-api/src/libs/db/db-converters";

module.exports = async (handle: string) => {
  let description: string = process.argv.slice(3).join(` `);

  const dates = new RecordDates(dateYYYYMMDD(new Date()));
  dates.completed_on = dates.created_on;

  const id = genGuid();

  if (description.length) {
    const view: RecordView = {
      id: id,
      description: description,
      created_on: dates.created_on,
      started_on: dates.started_on,
      due_on: dates.due_on,
      completed_on: dates.completed_on,
      tags: Array(),
    };

    const record = recordFromView(view);
    dbCreateRecord(record, handle);
    return;
  }

  do {
    description = reader.question(" completed? ");
    if (description.length) {
      const view = dbNewView(description, dates, id);
      const record = recordFromView(view);
      dbCreateRecord(record, handle);
    }
  } while (description.length);
};
