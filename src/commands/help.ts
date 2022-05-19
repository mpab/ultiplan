// help on using commands 

const menus: {[index: string]:any} = {
  main: `
    tasks [command] <options>

    create-sample-tasks ................ create sample task data
    help ................................ help on using commands
    list-csv ...................... list all tasks in CSV format
    list-json .................... list all tasks in JSON format
    note ................... add a note (todo item, no planning)
    record ............................. record a completed task
    today ........................ show all open tasks for today
    track ......................................... start a task
    version ....................... show the application version
`,
}
module.exports = (args: { _: any[] }) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}
