//interface TagArray extends Array<[...any]>{}

export type DbRecordItem = Array<null | string | Array<string> | Array<DbRecordItem>>;

export interface DbRecord {
    description: string,
    created_on: string,
    started_on: string,
    due_on: string,
    completed_on: string,
    project: string,
    tags: DbRecordItem,
}

export interface DbRecordDates {
    created_on: string,
    started_on: string,
    due_on: string,
    completed_on: string,
}