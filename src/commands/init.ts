// initializes the application

import { dbInit } from "../db/db-util";

module.exports = () => {
  dbInit();
};