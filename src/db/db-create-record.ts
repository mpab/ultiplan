import { DbRecord } from "./db-record";
import { getDbHandle } from "./db-util";

// TODO: multi-record update is not working

module.exports = (new_record: DbRecord, jsonFile: string = getDbHandle()) => {
  const fs = require("fs");

  // validate item
  let item_errors = "";
  if (!new_record.description) {
    item_errors += "no description, ";
    }

  if (!new_record.created_on) {
    item_errors += "no created_on, ";
  }

  if (item_errors.length) {
    return console.error(item_errors);
  }

  let records: DbRecord[] = [];

  fs.readFile(jsonFile, function (err: any, json_string: string) {
    if (err) {
      console.warn(err);
    } else {
      records = JSON.parse(json_string);
      console.log("read " + records.length + " records from " + jsonFile);
    }

    records.push(new_record);
    
    console.log("writing '" + new_record.description + "' to " + jsonFile);
    fs.writeFile(jsonFile, JSON.stringify(records, null, "  "), function (err: any) {
      if (err) {
        return console.error(err);
      }
    });

    //console.log(obj);
  });
};
