// record a completed task

const dateYYYYMMDD = require("../utils/dates");
const dbCreateRecord = require("../db/db-create-record");

const reader = require("readline-sync");

import { exit } from "process";
import { DbRecord } from "../db/db-record";

module.exports = () => {
    var dateString = dateYYYYMMDD(new Date());
    const description: string = reader.question(dateString + " record? ");
    if (!description.length) exit();
    const default_project_name = require('../utils/project-info')().name;
    const project_name: string = reader.question(`project? (enter=${default_project_name}) `, {defaultInput: default_project_name});
    var item: DbRecord = {
        description: description,
        created_on: dateString,
        started_on: dateString,
        due_on: dateString,
        completed_on: dateString,
        project: project_name,
        tags: [],
    };
    dbCreateRecord(item);
}