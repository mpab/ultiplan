# design

## data model

data is stored in k,v json file(s)

- record

```json
{
  "name": "",                             // mandatory queued
  "project": "",                          // mandatory queued
  "start_date": "",                       // optional, semantically significant
  "due_date": "",                         // optional, semantically significant
  "completion_date":  "",                 // optional, semantically significant
  "description": "",                      // optional, semantically significant
  "comments": ["comment 1", "comment 2",] // optional, semantically significant
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