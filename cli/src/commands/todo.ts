// add a todo task

import reader from "readline-sync";

import dateYYYYMMDD from "libs/src/utils/dates";
import dbCreateRecord from "libs/src/db/db-create-record";
import genGuid from "libs/src/utils/generate-uuid";
import { DbRecord, DbRecordDates } from "libs/src/db/db-record";
import dbNewRecord from './shared/new-record';
import projectInfo from "libs/src/utils/project-info";

const index = async (handle: string) => {
  let description: string = process.argv.slice(3).join(` `);

  const date = dateYYYYMMDD(new Date());
  const dates: DbRecordDates = {
    created_on: date,
    started_on: "",
    due_on: "",
    completed_on: "",
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
    description = reader.question("add todo? ");
    if (description.length) {
      dbCreateRecord(dbNewRecord(description, dates, id));
    }
  } while (description.length);
};

module.exports = async (handle: string) => {
  index(handle);
}

export default index;
