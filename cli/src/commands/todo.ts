// add a todo task

import reader from "readline-sync";

import dateYYYYMMDD from "ultiplan-api/src/libs/utils/dates";
import dbCreateRecord from "ultiplan-api/src/libs/db/db-create-record";
import genGuid from "ultiplan-api/src/libs/utils/generate-uuid";
import { DbRecord, DbRecordDates } from "ultiplan-api/src/libs/db/db-record";
import { getDbHandle } from "../utils/db-handle";
import dbNewRecord from './shared/new-record';
import projectInfo from "../utils/project-info";

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

    dbCreateRecord(record, getDbHandle());
    return;
  }

  do {
    description = reader.question("add todo? ");
    if (description.length) {
      dbCreateRecord(dbNewRecord(description, dates, id), getDbHandle());
    }
  } while (description.length);
};

module.exports = async (handle: string) => {
  index(handle);
}

export default index;
