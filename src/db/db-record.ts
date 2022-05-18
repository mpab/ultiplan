interface TagArray extends Array<[...any]>{}

export interface DbRecord {
    description: string,
    created_on: string,
    started_on: string,
    due_on: string,
    completed_on: string,
    project: string,
    tags: TagArray,
}