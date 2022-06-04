// help on using commands 

const menus: {[index: string]:any} = {
  main: `
    tasks [command] <options>

    create-sample-tasks ................ create sample task data
    done ............................... record a completed task
    help ................................ help on using commands
    init ....... initializes a project (creates a task database)
    ls ............................ list tasks (non-recursively)
    report ............................. generate a tasks report
    schedule ................................... schedule a task
    today ........................ show all open tasks for today
    todo ............................................ add a todo
    version ....................... show the application version
`,
}
module.exports = () => {
  const args = require(`minimist`)(process.argv.slice(2));
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}
