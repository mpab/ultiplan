// delete a task by its id

import dbDelete from 'ultiplan-api/src/libs/db/db-delete-record';
import { getDbHandle } from "../utils/db-handle";

const index = async (handle: string) => {
  let id: string = process.argv.slice(3).join(` `);
  if (!id.length) return;
  console.log(dbDelete(id, getDbHandle())? 'deleted' : 'not found');
};

module.exports = async (handle: string) => {
  index(handle);
}

export default index;
