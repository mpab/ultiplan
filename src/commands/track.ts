const dateYYYYMMDD = require("../utils/dates");
const dbCreateItem = require("../db/db-create-item");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

import { exit } from "process";
const error = require("../utils/error");
import { DbRecord } from "../db/db-record";

module.exports = async () => {
    var dateString = dateYYYYMMDD(new Date());
    error("track not yet implemented", true);

    console.log("track " + dateString);
    rl.question("what do you want to track? ", function (description: string) {
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
            dbCreateItem(item);
            rl.close();
        });
    });
}