const fs = require("fs");
const jsonFile = process.cwd() + "\\data\\tasks.json";

module.exports = (item, exit) => {
    // validate item
    let item_errors = "";
    if (!item.description) {
      item_errors += "no description, "
    }

    if (!item.created_on) {
      item_errors += "no created_on, "
    }

    if (!item.started_on) {
      item_errors += "no started_on, "
    }

    if (!item.due_on) {
      item_errors += "no due_on, "
    }

    if (!item.tags) {
      item_errors += "no tags, "
    }

    if (item_errors.length) {
      return console.error(item_errors);
    }

    fs.readFile(jsonFile, function (err, data) {
        if (err) {
          return console.error(err);
        }
        const db = JSON.parse(data);
        db.push(item);

        console.log("writing " + jsonFile);
        fs.writeFile(jsonFile, JSON.stringify(db, null, "  "), function (err) {
          if (err) {
            return console.error(err);
          }
        });

        //console.log(obj);
      });
}