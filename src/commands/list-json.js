const fs = require("fs");
const jsonFile = process.cwd() + "\\data\\tasks.json";

module.exports = async (args) => {
  console.log("reading " + jsonFile);

  fs.readFile(jsonFile, function (err, data) {
    if (err) {
      return console.error(err);
    }
    const json = JSON.parse(data);
    console.log(json);
  });
}