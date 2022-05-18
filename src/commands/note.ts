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
    console.log("note " + dateString);
    rl.question("what do you want to make a note of? ", function (description: string) {
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
            dbCreateItem(item);
            rl.close();
        });
    });
}