const fs = require("fs");
const filePath = process.cwd() + "\\data\\tasks.json";
const dateYYYYMMDD = require("../utils/dateYYYYMMDD");

module.exports = async (args) => {
    var dateString = dateYYYYMMDD(new Date());
    console.log("task " + dateString);
}