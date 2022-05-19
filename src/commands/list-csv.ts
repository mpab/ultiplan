// list all tasks in CSV format

module.exports = async () => {
  const fs = require("fs");
  const jsonFile = process.cwd() + "\\data\\tasks.json";
  const csvFile = process.cwd() + "\\data\\tasks.csv";

  fs.readFile(jsonFile, function (err: any, data: string) {
    if (err) {
      console.error(err);
    }
    const json = JSON.parse(data);
    const { parse } = require("json2csv");
    const fields = [
      "description",
      "created_on",
      "started_on",
      "due_on",
      "completed_on",
      "project",
      "tags",
    ];
    const opts = { fields };
    const csv = parse(json, opts);
    console.log(csv);
  });
};

// (async () => {
//   const data = await parseJSONFile(inputFileName);
//   const csv = await j2c.json2csvAsync(data);
//   writeCSV(outputFileName, csv);
//   console.log(`Successfully converted ${outputFileName}!`);
// })();
