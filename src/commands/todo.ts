// add a todo

const dateYYYYMMDD = require("../utils/dates");
const dbCreateRecord = require("../db/db-create-record");
const reader = require("readline-sync");
import { exit } from "process";
import { DbRecordItem, DbRecord } from "../db/db-record";


module.exports = () => {
    var dateString = dateYYYYMMDD(new Date());
    const description: string = reader.question(dateString + " todo? ");
    if (!description.length) exit();
    const default_project_name = require('../utils/project-info')().name;
    const project_name: string = reader.question(`project? (enter=${default_project_name}) `, {defaultInput: default_project_name});
    let tags = Array<string>() as DbRecordItem;

    let tag_v;

    do {
        tag_v = reader.question(`tag? `);
        if (tag_v && tags) tags.push(tag_v);
        //if (tag.length) ttags.push(tag);
    } while (tag_v);

    var item: DbRecord = {
        description: description,
        created_on: dateString,
        started_on: "",
        due_on: "",
        completed_on: "",
        project: project_name,
        tags: tags,
    };
    dbCreateRecord(item);
}
