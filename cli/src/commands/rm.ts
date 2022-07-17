// delete a task by its id

import dbDelete from 'ultiplan-api/src/libs/db/db-delete-record';

module.exports = async (handle: string) => {
  let id: string = process.argv.slice(3).join(` `);
  if (!id.length) return;
  console.log(dbDelete(id, handle)? `deleted ${id}` : `${id} not found`);
};
