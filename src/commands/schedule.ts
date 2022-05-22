// schedule a task

const dateYYYYMMDD = require("../utils/dates");
const dbCreateRecord = require("../db/db-create-record");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

import { exit } from "process";
const error = require("../utils/error");
import { DbRecord } from "../db/db-record";

module.exports = () => {
    var dateString = dateYYYYMMDD(new Date());
    error("schedule not yet implemented", true);
    rl.question(dateString + " schedule? ", function (description: string) {
        if (!description.length) exit();
        rl.question("project? ", function (project: string) {
            var item: DbRecord = {
                description: description,
                created_on: dateString,
                started_on: dateString,
                due_on: "",
                completed_on: "",
                project: project,
                tags: [],
            };
            dbCreateRecord(item);
            rl.close();
        });
    });
}