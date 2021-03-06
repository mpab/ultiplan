# design

## data model

data is stored in k,v json file(s)

basic pattern

```json
"id": "65171d2c-dce1-4fa6-df03-f91a3590c54b",
"description": "...",
"project": "...",
"dates": {
  "created_on": "2022-06-05"
},
"tags": []
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
