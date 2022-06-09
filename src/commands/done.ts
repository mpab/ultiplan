const dateYYYYMMDD = require("../utils/dates");
const dbCreateRecord = require("../db/db-create-record");
const reader = require("readline-sync");
import { DbRecord, DbRecordDates } from "../db/db-record";

module.exports = () => {
  let description: string = process.argv.slice(3).join(` `);

  const date = dateYYYYMMDD(new Date());
  const dates: DbRecordDates = {
    created_on: date,
    started_on: date,
    due_on: date,
    completed_on: date,
  };

  if (description.length) {
    const record: DbRecord = {
      description: description,
      created_on: dates.created_on,
      started_on: dates.started_on,
      due_on: dates.due_on,
      completed_on: dates.completed_on,
      project: require("../utils/project-info")().name,
      tags: Array(),
    };

    dbCreateRecord(record);
    return;
  }

  do {
    description = reader.question(" completed? ");
    if (description.length) {
      dbCreateRecord(require("../db/new-record")(description, dates));
    }
  } while (description.length);
};