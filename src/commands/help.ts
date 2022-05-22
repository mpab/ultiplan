// help on using commands 

const menus: {[index: string]:any} = {
  main: `
    tasks [command] <options>

    create-sample-tasks ................ create sample task data
    dbinit ............................ initializes the database
    help ................................ help on using commands
    list-csv ...................... list all tasks in CSV format
    list-json .................... list all tasks in JSON format
    list ........................................ list all tasks
    record ............................. record a completed task
    report-md .............. generate a tasks report in markdown
    schedule ................................... schedule a task
    today ........................ show all open tasks for today
    todo ............................................ add a todo
    version ....................... show the application version
`,
}
module.exports = (args: { _: any[] }) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}
