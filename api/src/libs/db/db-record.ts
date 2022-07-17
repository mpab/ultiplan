export type DbRecordItem = Array<
  null | string | Array<string> | Array<DbRecordItem>
>;

export interface RecordView {
  id: string; // uuid
  description: string;
  created_on: string;
  started_on: string;
  due_on: string;
  completed_on: string;
  tags: DbRecordItem;
}

type DatesKeys = `created_on` | `started_on` | `due_on` | `completed_on`;
export type Dates = { [k in DatesKeys]?: string };

export interface DbRecord_2022_07_16 {
  id: string;
  description: string;
  dates: Dates;
  tags: DbRecordItem;
}
