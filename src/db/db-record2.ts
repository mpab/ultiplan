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

export interface Tag {
    key: string
    val: null | string | Array<Tag>
}

export interface DbRecord_00_01_00 {
    schema: Array<number> = [0x00, 0x01, 0x00];
    tasks: Array<Tag>;    
}

interface TagArray extends Array<[...any]>{}

export interface DbRecord {
    getSchema: () number => 1;
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