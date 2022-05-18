const dateYYYYMMDD = require("../utils/dates");
const dbCreateItem = require("../db/db-create-item");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

import { exit } from "process";
import { DbRecord } from "../db/db-record";

module.exports = async () => {
    var dateString = dateYYYYMMDD(new Date());
    console.log("record " + dateString);
    rl.question("what has been completed? ", function (description: string) {
        if (!description.length) exit();
        rl.question("project? ", function (project: string) {
            var item: DbRecord = {
                description: description,
                created_on: dateString,
                started_on: dateString,
                due_on: dateString,
                completed_on: dateString,
                project: project,
                tags: [],
            };
            dbCreateItem(item);
            rl.close();
        });
    });
}