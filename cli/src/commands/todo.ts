// add a todo task

import reader from "readline-sync";

import dateYYYYMMDD from "ultiplan-api/src/libs/utils/dates";
import dbCreateRecord from "ultiplan-api/src/libs/db/db-create-record";
import genGuid from "ultiplan-api/src/libs/utils/generate-uuid";
import { RecordView } from "ultiplan-api/src/libs/db/db-record";
import { getDbHandle } from "../utils/db-handle";
import dbNewView from "./shared/new-view";
import projectInfo from "../utils/project-info";
import { RecordDates, recordFromView } from "ultiplan-api/src/libs/db/db-converters";

const index = async (handle: string) => {
  let description: string = process.argv.slice(3).join(` `);

  const dates = new RecordDates(dateYYYYMMDD(new Date()));

  const id = genGuid();

  if (description.length) {
    const view: RecordView = {
      id: id,
      description: description,
      created_on: dates.created_on,
      started_on: dates.started_on,
      due_on: dates.due_on,
      completed_on: dates.completed_on,
      project: projectInfo().name,
      tags: Array(),
    };
    console.dir(view);

    const record = recordFromView(view);
    console.dir(record);

    dbCreateRecord(record, getDbHandle());
    return;
  }

  do {
    description = reader.question("add todo? ");
    if (description.length) {
      const view = dbNewView(description, dates, id);
      const record = recordFromView(view);
      dbCreateRecord(record, getDbHandle());
    }
  } while (description.length);
};

module.exports = async (handle: string) => {
  index(handle);
};

export default index;
