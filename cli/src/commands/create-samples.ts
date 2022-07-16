// create sample task data

import fs from "fs";

import genGuid from "ultiplan-api/src/libs/utils/generate-uuid";
import { RecordView} from "ultiplan-api/src/libs/db/db-record";
import { getAndCheckDbHandle, getDbHandle } from "../utils/db-handle";

module.exports = () => {
  const sampleDb = `sample-tasks.json`;

  const [shouldBeNull] = getAndCheckDbHandle(sampleDb);
  if (shouldBeNull) {
    console.warn("DB already exists: " + shouldBeNull);
    return;
  }

  const sampleDbFilepath = getDbHandle(`./`, sampleDb);

  const data: RecordView[] = [];

  var item: RecordView = {
    id: "",
    description: "define initial task data model (nosql, json)",
    created_on: "2022-05-15",
    started_on: "2022-05-15",
    due_on: "2022-05-15",
    completed_on: "2022-05-15",
    project: "ultiplan",
    tags: [],
  };
  item.id = genGuid();
  data.push(item);

  item = { ...item }; // copy by value
  item.description = "transcribe post-its";
  item.due_on = item.completed_on = "";
  item.id = genGuid();
  data.push(item);

  item = { ...item }; // copy by value
  item.description =
    "auto configure commands such that they can be added automatically";
  item.due_on = item.completed_on = "";
  item.started_on = "";
  item.project = "ultiplan";
  item.id = genGuid();
  data.push(item);

  item = { ...item }; // copy by value
  item.description = "basic task saving using a JSON file";
  (item.created_on = "2022-05-16"),
    (item.due_on = item.completed_on = "2022-05-16");
  item.started_on = "2022-05-16";
  item.project = "ultiplan";
  item.id = genGuid();
  data.push(item);

  item = { ...item }; // copy by value
  item.description = "javascript references";
  (item.created_on = "2022-05-16"),
    (item.due_on = item.completed_on = "2022-05-16");
  item.started_on = "2022-05-16";
  (item.project = "learning javascript"),
    (item.tags = [
      ["url", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
      ["url", "https://www.w3schools.com/js/default.asp"],
    ]);
  item.id = genGuid();
  data.push(item);

  item = { ...item }; // copy by value
  item.description = "tags test";
  (item.created_on = "2022-05-16"),
    (item.due_on = item.completed_on = "2022-05-16");
  item.started_on = "2022-05-16";
  (item.project = "tags test"),
    (item.tags = [["t0"], ["t1", "t1.1"], ["t2", "t2.1", "t2.2"]]);
  item.id = genGuid();
  data.push(item);

  fs.writeFile(
    sampleDbFilepath,
    JSON.stringify(data, null, "  "),
    function (err: any) {
      if (err) {
        return console.error(err);
      }
    }
  );

  console.log(`created sample db ${sampleDbFilepath}`);
};
