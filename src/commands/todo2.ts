// add a todo2

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
    let tags = Array<DbRecordItem>() as DbRecordItem;

    let tag_v;

    const tag_n = reader.question(`tag name? `);

    if (tag_n) {
        let inner_tags = Array<string>();
        do {           
            tag_v = reader.question(`tag? `);
            if (tag_v && inner_tags) inner_tags.push(tag_v);
        } while (tag_v);

        tags.push(tag_n);
        tags.push(inner_tags);
    }

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
