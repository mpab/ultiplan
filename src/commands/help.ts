// help on using commands 

const menus: {[index: string]:any} = {
  main: `
    tasks [command] <options>

    create-sample-tasks ................ create sample task data
    help ................................ help on using commands
    list ........................................ list all tasks
    list-csv ...................... list all tasks in CSV format
    list-json .................... list all tasks in JSON format
    record ............................. record a completed task
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
