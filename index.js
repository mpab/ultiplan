const minimist = require('minimist')
const error = require('./utils/error')

module.exports = () => {
  const args = minimist(process.argv.slice(2))

  let cmd = args._[0] || 'help'

  if (args.version || args.v) {
    cmd = 'version'
  }

  if (args.help || args.h) {
    cmd = 'help'
  }

  switch (cmd) {
    case 'canned-data':
       require('./commands/canned-data')(args)
       break

    case 'add-achievement':
      require('./commands/add-achievement')(args)
      break

      case 'add-note':
      require('./commands/add-note')(args)
      break

      case 'add-task':
      require('./commands/add-task')(args)
      break

    case 'list-json':
      require('./commands/list-json')(args)
      break

    case 'list-csv':
      require('./commands/list-csv')(args)
      break

    case 'today':
      require('./commands/today')(args)
      break

    case 'forecast':
      require('./commands/forecast')(args)
      break

    case 'version':
      require('./commands/version')(args)
      break

    case 'help':
      require('./commands/help')(args)
      break

    default:
      error(`"${cmd}" is not a valid command!`, true)
      break
  }
}
