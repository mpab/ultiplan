// add a completed task 

import reader from "readline-sync";

import dateYYYYMMDD from "libs/src/utils/dates";
import dbCreateRecord from "libs/src/db/db-create-record";
import genGuid from "libs/src/utils/generate-uuid";
import { DbRecord, DbRecordDates } from "libs/src/db/db-record";
import dbNewRecord from './shared/new-record';
import projectInfo from "libs/src/utils/project-info";

module.exports = () => {
  let description: string = process.argv.slice(3).join(` `);

  const date = dateYYYYMMDD(new Date());
  const dates: DbRecordDates = {
    created_on: date,
    started_on: date,
    due_on: date,
    completed_on: date,
  };

  const id = genGuid();

  if (description.length) {
    const record: DbRecord = {
      id: id,
      description: description,
      created_on: dates.created_on,
      started_on: dates.started_on,
      due_on: dates.due_on,
      completed_on: dates.completed_on,
      project: projectInfo().name,
      tags: Array(),
    };

    dbCreateRecord(record);
    return;
  }

  do {
    description = reader.question(" completed? ");
    if (description.length) {
      dbCreateRecord(dbNewRecord(description, dates, id));
    }
  } while (description.length);
};