interface TagArray extends Array<[...any]>{}

export interface DbRecord_0x {
    description: string,
    created_on: string,
    started_on: string,
    due_on: string,
    completed_on: string,
    project: string,
    tags: TagArray,
}

export interface DbRecord_1x {
    schema: number,
    info: TagArray,
    dates: TagArray,
    tags: TagArray,
}

export interface DbRecord {
    getSchema: () => number;
    getDescription: () => string;
    getCreatedOn: () => string;
    getStartedOn: () => string;
    getDueOn: () => string;
    getCompletedOn: () => string;
    getProject: () => string;
    getTags(): TagArray;

}

export const DbRecordFactory = (jsonData: JSON): DbRecord => {
    JSON.parse(data)

}