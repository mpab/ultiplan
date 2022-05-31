// list all tasks in JSON format

import { getDbHandle } from "../db/db-util";

module.exports = () => {
  const fs = require("fs");

  fs.readFile(getDbHandle(), function (err: any, data: string) {
    if (err) {
      return console.error(err);
    }
    const json = JSON.parse(data);
    console.log(json);
  });
};
