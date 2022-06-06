// add a todo

const dateYYYYMMDD = require("../utils/dates");
const dbCreateRecord = require("../db/db-create-record");
const reader = require("readline-sync");
import { exit } from "process";
import { DbRecord } from "../db/db-record";

module.exports = () => {
    var dateString = dateYYYYMMDD(new Date());
    const description: string = reader.question(dateString + " todo? ");
    if (!description.length) exit();
    const default_project_name = require('../utils/project-info')().name;
    const project_name: string = reader.question(`project? (enter=${default_project_name}) `, {defaultInput: default_project_name});
    let ttags = Array<Array<string>>();

    let tag_v;

    do {
        const tag = Array<string>();
        tag_v = reader.question(`tag? `);
        if (tag_v) tag.push(tag_v);
        if (tag.length) ttags.push(tag);
    } while (tag_v);


    var item: DbRecord = {
        description: description,
        created_on: dateString,
        started_on: "",
        due_on: "",
        completed_on: "",
        project: project_name,
        tags: ttags,
    };
    dbCreateRecord(item);
}
