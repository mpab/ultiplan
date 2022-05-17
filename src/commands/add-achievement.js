const dateYYYYMMDD = require("../utils/dateYYYYMMDD");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const dbCreateItem = require('../db/dbCreateItem');

module.exports = async (args) => {
    var dateString = dateYYYYMMDD(new Date());
    console.log("achievement " + dateString);
    rl.question("what has been completed? ", function (description) {
        rl.question("project? ", function (project) {
            var item = {
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