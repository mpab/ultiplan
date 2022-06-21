// help on using commands 

const menus: {[index: string]:any} = {
  main: `
    tasks [command] <options>

    add ............................... alias to add a todo task
    create-sample-tasks ................ create sample task data
    done ................................. add a completed task 
    help ................................ help on using commands
    init ....... initializes a project (creates a task database)
    ls ...................... list tasks (with recursive option)
    mv ................. moves/renames a project (non-recursive)
    report ............................. generate a tasks report
    schedule ................................... schedule a task
    today ........................ show all open tasks for today
    todo ....................................... add a todo task
    version ....................... show the application version
`,
  ls: `
    tasks list <options>
    --r, -r (recursively)`,
}
module.exports = () => {
  const args = require('minimist')(process.argv.slice(2));
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main);
};
