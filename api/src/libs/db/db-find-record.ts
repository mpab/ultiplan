import dbLoad from './db-load';

const dbFindRecord = (id: string, handle: string) => {
  const [records, error] = dbLoad(handle);
  if (error) return;

  if (!records.length) {
    console.log(`empty DB at ${handle}`);
    return;
  }
  return records.filter((record) => record.id === id)[0];
};

export default dbFindRecord;
