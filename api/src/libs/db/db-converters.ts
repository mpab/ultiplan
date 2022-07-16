import dbLoad, { logErrorAndReturnCollection } from './db-load';
import { DbRecord_2022_07_16, RecordView } from './db-record';

const copyAttr = (from: any, to: any, key: string) => {
  if (from[key]) to[key] = from[key];
};

export const assignDates = (from: any, to: any) => {
  copyAttr(from, to, 'created_on');
  copyAttr(from, to, 'started_on');
  copyAttr(from, to, 'due_on');
  copyAttr(from, to, 'completed_on');
};

export class RecordDates {
  constructor(created: string) {
    this.created_on = created;
    this.started_on = ``;
    this.due_on = ``;
    this.completed_on = ``;
  }
  created_on: string;
  started_on: string;
  due_on: string;
  completed_on: string;
}

export const recordFromView = (view: RecordView): DbRecord_2022_07_16 => {
  const record: DbRecord_2022_07_16 = {
    id: view.id,
    description: view.description,
    project: view.project,
    dates: {},
    tags: view.tags,
  };
  assignDates(view, record.dates);
  return record;
};

export const viewFromRecord = (record: DbRecord_2022_07_16): RecordView => {
  const view = {
    id: record.id,
    description: record.description,
    project: record.project,
    tags: record.tags,

    created_on: ``, //m2s(record.dates, DatesKey.created_on),
    started_on: ``, //m2s(record.dates, DatesKey.started_on),
    due_on: ``, //m2s(record.dates, DatesKey.due_on),
    completed_on: ``, // m2s(record.dates, DatesKey.completed_on),
  };
  assignDates(record.dates, view);
  return view;
};

export const dbLoadAsView = (handle: string): [RecordView[], string] => {
  const views = new Array<RecordView>();
  const [records, error] = dbLoad(handle);
  if (error) return [views, error];

  for (const item of records) {
    let view: RecordView;
    try {
      const record = item as DbRecord_2022_07_16;
      view = viewFromRecord(record);
    } catch (e) {
      console.error(e);
      return logErrorAndReturnCollection(
        'schema error - try cli upschema command to upgrade',
      );
    }
    views.push(view);
  }

  return [views, ''];
};
