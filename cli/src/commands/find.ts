// find a task by its id

import { getDbHandle } from "../utils/db-handle";
import dbFind from 'ultiplan-api/src/libs/db/db-find-record';

const index = async (handle: string) => {
  let id: string = process.argv.slice(3).join(` `);
  if (!id.length) return;
  console.log(dbFind(id, getDbHandle()));
};

module.exports = async (handle: string) => {
  index(handle);
}

export default index;
