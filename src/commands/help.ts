const menus: {[index: string]:any} = {
  main: `
    tasks [command] <options>

    canned-data ........ create sample data
    record ............. add a completed, unplanned task 
    add-note ........... add a note (can be converted into a task later)
    add-task ........... add a planned task
    today .............. show tasks for today
    verify ............. checks data integrity
    version ............ show package version
    help ............... show help menu for a command`,
}

module.exports = (args: { _: any[] }) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}
