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

basic pattern

```json
[{[string, null | string | [,..]]}, ...]
```

```json
{
  [string, null | string | [,..]],
  ["schema"]
  ["description", "" | [,..]],
  ["dates", "" | [,..]],
  ["tags, "" | [,..]]
},
```

## task model

### task creation

| name     | description                                           | dates                                                                        |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| todo     | it's on the todo list (backlog)                       | not planned, no dates                                                        |
| record   | it's been done                                        | not planned, completed when created (start=completed=due) date               |
| kanban   | it's done when it's done                              | planned start, no due date                                                   |
| schedule | it's been planned and it's known when it will be done | planned start, due date - the completion date may be later than the due date |

### task transitions and lifecycles

**states**

- unplanned
- planned
- active
- done
- late

| name/state         | transitions                                                                                                                | notes                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| todo (unplanned)   | todo->record <br> todo->kanban <br> todo->schedule                                                                         |                                                        |
| record             | N/A                                                                                                                        | created in its final state                             |
| kanban (planned)   | kanban (planned) -> kanban (active) <br> kanban (planned) -> kanban (closed) <br> kanban (planned) -> kanban (active) <br> | completed_on field is updated (due_on is never filled) |
| schedule (planned) | kanban (open) -> kanban (closed)                                                                                           | completed_on field is updated (due_on is never filled) |

## state model

- created name
- queued name, start_date <= today
- active, start_date >= today, end_date >= today
- completed,
- overdue:

## database/data storage

initially:json array
mongodb?
