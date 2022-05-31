import errorExit from "./utils/error-exit";
import { getDbHandle } from "./db/db-util";
const minimist = require(`minimist`);
 
const index = () => {
  const args = minimist(process.argv.slice(2));

  let cmd = args._[0] || `help`;
 
  if (args.version || args.v) {
    cmd = `version`;
  }
 
  if (args.help || args.h) {
    cmd = "help";
  }

  const handle = getDbHandle(true);
  const noDbIsFatal = cmd === `dbinit` || cmd === `help`;
  if (!handle && !noDbIsFatal) errorExit("a database is required, use the init command");
 
  // generated command handlers
  switch (cmd) {
    case "create-sample-tasks":
      require("./commands/create-sample-tasks")(args);
      break;

    case "help":
      require("./commands/help")(args);
      break;

    case "init":
      require("./commands/init")(args);
      break;

    case "list":
      require("./commands/list")(args);
      break;

    case "list-csv":
      require("./commands/list-csv")(args);
      break;

    case "list-json":
      require("./commands/list-json")(args);
      break;

    case "record":
      require("./commands/record")(args);
      break;

    case "report-md":
      require("./commands/report-md")(args);
      break;

    case "schedule":
      require("./commands/schedule")(args);
      break;

    case "today":
      require("./commands/today")(args);
      break;

    case "todo":
      require("./commands/todo")(args);
      break;

    case "version":
      require("./commands/version")(args);
      break;

    default:
      errorExit(`"${cmd}" is not a valid command`);
      break;
  }
};
 
export default index();
