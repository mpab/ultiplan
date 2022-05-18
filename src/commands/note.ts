const dateYYYYMMDD = require("../utils/dates");
const dbCreateRecord = require("../db/db-create-record");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

import { exit } from "process";
import { DbRecord } from "../db/db-record";

module.exports = async () => {
    var dateString = dateYYYYMMDD(new Date());
    rl.question(dateString + " note? ", function (description: string) {
        if (!description.length) exit();
        rl.question("project? ", function (project: string) {
            var item: DbRecord = {
                description: description,
                created_on: dateString,
                started_on: "",
                due_on: "",
                completed_on: "",
                project: project,
                tags: [],
            };
            dbCreateRecord(item);
            dbCreateRecord(item);
            rl.close();
        });
    });
}