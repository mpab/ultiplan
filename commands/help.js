const menus = {
  main: `
    tasks [command] <options>

    add-achievement .... add a completed, unplanned task 
    add-note ........... add a note (can be converted into a task later)
    add-task ........... add a planned task
    canned-data ........ create sample data
    today .............. show tasks for today
    verify ............. checks data integrity
    version ............ show package version
    help ............... show help menu for a command`,
}

module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}
