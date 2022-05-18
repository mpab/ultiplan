# design

## data model

data is stored in k,v json file(s)

- record

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

```json
{
  "description": "",                  // mandatory queued
  "project": "",                      // mandatory queued
  "created_on": "",                   // optional, semantically significant
  "started_on": "",                   // optional, semantically significant
  "due_on": "",                       // optional, semantically significant
  "completed_on":  "",                // optional, semantically significant
  "tags": [["t1"]["t2", "t2.1"], ...] // optional, semantically significant
},
```

## state model
  - created name
  - queued name, start_date <= today
  - active, start_date >= today, end_date >= today
  - completed, 
  - overdue:

## database/data storage

initially:json array
mongodb?