import { DbRecord } from "../db/db-record";
const fs = require("fs");

module.exports = async () => {

  let data: DbRecord[] = [];

  var item: DbRecord = {
    description: "define initial task data model (nosql, json)",
    created_on: "2022-05-15",
    started_on: "2022-05-15",
    due_on: "2022-05-15",
    completed_on: "2022-05-15",
    project: "ultiplan", 
    tags: [] 
  };
  data.push(item);

  item = {...item}; // copy by value
  item.description = "transcribe post-its"
  item.due_on = item.completed_on = ""
  data.push(item);

  item = {...item}; // copy by value
  item.description = "auto configure commands such that they can be added automatically"
  item.due_on = item.completed_on = ""
  item.started_on = ""
  item.project = "ultiplan"
  data.push(item);

  item = {...item}; // copy by value
  item.description = "basic task saving using a JSON file"
  item.created_on = "2022-05-16",
  item.due_on = item.completed_on = "2022-05-16"
  item.started_on = "2022-05-16"
  item.project = "ultiplan"
  data.push(item);

  item = {...item}; // copy by value
  item.description = "javascript references"
  item.created_on = "2022-05-16",
  item.due_on = item.completed_on = "2022-05-16"
  item.started_on = "2022-05-16"
  item.project = "learning javascript",
  item.tags = [
    ["url", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
    ["url", "https://www.w3schools.com/js/default.asp"],
  ];
  data.push(item);

  item = {...item}; // copy by value
  item.description = "tags test"
  item.created_on = "2022-05-16",
  item.due_on = item.completed_on = "2022-05-16"
  item.started_on = "2022-05-16"
  item.project = "tags test",
  item.tags = [
    ["t0"],
    ["t1", "t1.1"],
    ["t2", "t2.1", "t2.2"],
  ];
  data.push(item);

  const filePath = process.cwd() + "\\data\\sample-tasks.json";

  fs.writeFile(filePath, JSON.stringify(data, null, "  "), function (err: any) {
    if (err) {
      return console.error(err);
    }
  });
}