// list all tasks in JSON format

module.exports = async (args: { _: any[] }) => {
  const fs = require("fs");
  const jsonFile = process.cwd() + "\\data\\tasks.json";

  console.log("reading " + jsonFile);

  fs.readFile(jsonFile, function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const json = JSON.parse(data);
    console.log(json);
  });
};
