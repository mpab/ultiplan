# PROJECTS
## ultiplan

### todo: ultiplan
- implement a basic web UI for task creation and viewing
- create note alias for todo command
- consider how to link tasks to learnings/learning paths
- add task edit (update) functionality
- implement local tasks repo/deployment (with default project?)
- implement links between ultiplan repos (hierarchichal, sibling, ...)
- add parameters to commands
- design: data flows, aggregation, and task creation (inbox concept)
- implement check to determine if duplicate tasks are being created
- implement analysis mode to scan tasks for similarities, extract keywords, suggest groupings, etc
- implement multi-line text entry/handle commas
- improve list command formatting
- design: how to integrate browser favourites?
- design: how to integrate gists?
- add ability to specify sub-projects/epics/BTIs (Big Ticket Items) for sub-grouping within a project
- add lists to descriptions using dash (-) separators and use these to format the reports
- reporting: implement calendar display
- design: implement a workflow concept to support tracking of events - e.g. email communications
- similar app - noteplan
    - https://noteplan.co/
    - https://medium.com/hackernoon/markdown-calendar-notes-28b87f965e5d
    - https://hackernoon.com/markdown-calendar-notes-28b87f965e5d
    - https://medium.com/hackernoon/markdown-calendar-notes-28b87f965e5d
- design: how to separate notes, tasks, learning tasks, reading (learning) articles
- simplify adding tasks - 'add' command, default to 'todo'
- implement true cli - with menu system to navigate commands
- implement projects using tags - will simplify the data model
- implement auto-linking of data, e.g. registration when creating a new DB
- when adding a task, pick up the comment as a parameter
- installer: detect shell environment and update correct profile (sh, bash, zsh, ...)
- task schema: refactor named fields to k,v tag model
- task schema: improve documentation

### done: ultiplan
- 2022-06-06: task schema: tags can now be added as groups
- 2022-06-04: extract diff from tracker to use as git commit message
- 2022-06-04: references: implement reference extraction to markdown (url tags)
- 2022-06-04: improve task entry to support tags
- 2022-06-04: implement scanning of local subdirectories for project name selection
- 2022-06-04: implement recursive project ls feature
- 2022-06-04: fix: can't create local DB if global DB not present - removed global DB
- 2022-06-04: implement recursive markdown report generation
- 2022-06-03: create install script
- 2022-06-01: refactor list command into ls command with --options
- 2022-06-01: use standard .ultiplan directory naming for DB
- 2022-05-23: reporting: implement date sorting
- 2022-05-23: implement default project response when creating a task
- 2022-05-22: reporting: create parameterized summary reports per project (output to markdown)
- 2022-05-22: reporting: implemented basic tracker (in markdown) for project
- 2022-05-21: implement separate tasks database
- 2022-05-19: auto configure commands such that they can be added automatically
- 2022-05-16: basic task saving using a JSON file
- 2022-05-15: define initial task data model (nosql, json)
---
## tests

### todo: tests
- this is a sample demonstrating refactoring of task schema to k, v tag model
- empty tags
- single tag item
    - a tag
- multiple tag item
    - tag 1
    - tag 2
    - tag 3
- multiple nested tag items
    - tag group 1
        - tag 1.1
        - tag 1.2
        - tag 1.3
    - tag group 2
        - tag 2.1
        - tag 2.2
        - tag 2.3
- multiple multiple nested tag items
    - tag group 1
        - tag 1.1
        - tag 1.2
        - tag 1.3
        - tag group 1.2
            - tag 1.2.1
            - tag 1.2.2
            - tag 1.2.3
    - tag group 2
        - tag 2.1
        - tag 2.2
        - tag 2.3

### done: tests
- 2022-05-15: this is a sample demonstrating composite tags
    - composite
        - dates
            - created_on
                - 2022-05-15
            - started_on
                - 2022-05-15
            - due_on
                - 2022-05-15
            - completed_on
                - 2022-05-15
---
