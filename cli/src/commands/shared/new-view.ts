import reader from "readline-sync";
import { RecordDates } from "ultiplan-api/src/libs/db/db-converters";

import { DbRecordItem, RecordView } from "ultiplan-api/src/libs/db/db-record";

const index = (
  description: string,
  recordDates: RecordDates,
  id: string,
): RecordView => {
  
  let tag_v;
  const tag_n = `tags`;
  // const tag_n = reader.question(`tag name? (enter=tags) `, {
  //   defaultInput: `tags`,
  // });
  const custom_tags = Array<string>();

  do {
    tag_v = reader.question(`${tag_n}:tag? `);
    if (tag_v) custom_tags.push(tag_v);
  } while (tag_v);

  const record: RecordView = {
    id: id,
    description: description,
    created_on: recordDates.created_on,
    started_on: recordDates.created_on,
    due_on: recordDates.due_on,
    completed_on: recordDates.completed_on,
    tags: Array<DbRecordItem>() as DbRecordItem,
  };

  if (tag_n === `tags`) {
    for (const it of custom_tags) record.tags.push(it);
  } else {
    // user-defined tags
    Object.defineProperty(record, tag_n, {
      value: custom_tags.length === 1 ? custom_tags[0] : custom_tags,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  return record;
};

export default index;
