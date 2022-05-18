const fs = require("fs");
const filePath = process.cwd() + "\\data\\tasks.json";

module.exports = async (args) => {

  let data = [];

  var item = new DbRecord {
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
  item.start_date = ""
  item.project = "ultiplan"
  data.push(item);

  item = {...item}; // copy by value
  item.description = "basic task saving using a JSON file"
  item.created_on = "2022-05-16",
  item.due_on = item.completed_on = "2022-05-16"
  item.start_date = "2022-05-16"
  item.project = "ultiplan"
  data.push(item);

  item = {...item}; // copy by value
  item.description = "javascript references"
  item.created_on = "2022-05-16",
  item.due_on = item.completed_on = "2022-05-16"
  item.start_date = "2022-05-16"
  item.project = "learning javascript",
  item.tags = [{"url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"}, {"url": "https://www.w3schools.com/js/default.asp"}]
  data.push(item);

  console.log("writing " + filePath);
  fs.writeFile(filePath, JSON.stringify(data, null, "  "), function (err) {
    if (err) {
      return console.error(err);
    }
  });
}