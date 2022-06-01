// initializes a project (creates a task database)

import { dbInit } from "../db/db-util";

module.exports = () => {
  dbInit();
};