// find a task by its id

import dbFind from 'ultiplan-api/src/libs/db/db-find-record';

module.exports = async (handle: string) => {
  let id: string = process.argv.slice(3).join(` `);
  if (!id.length) return;
  console.log(dbFind(id, handle));
};
