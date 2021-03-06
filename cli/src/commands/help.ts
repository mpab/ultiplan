// help on using commands 

const menus: {[index: string]:any} = {
  main: `
    tasks [command] <options>

    add ............................... alias to add a todo task
    check ..................... checks a project for data issues
    create-samples ..................... create sample task data
    done ................................. add a completed task 
    find ................................. find a task by its id
    help ................................ help on using commands
    init ................................. initializes a project
    ls ...................... list tasks (with recursive option)
    report ............................. generate a tasks report
    rm ................................. delete a task by its id
    schedule ................................... schedule a task
    today ........................ show all open tasks for today
    todo ....................................... add a todo task
    upschema ............................ upgrades the DB schema
    version-app ................... show the application version
    version-db ............................. show the db version
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
