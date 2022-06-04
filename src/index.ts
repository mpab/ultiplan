import errorExit from "./utils/error-exit";
import { getDbHandle } from "./db/db-util";
const minimist = require(`minimist`);
 
const index = async () => {
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
      await require("./commands/create-sample-tasks")(args);
      break;

    case "done":
      await require("./commands/done")(args);
      break;

    case "help":
      await require("./commands/help")(args);
      break;

    case "init":
      await require("./commands/init")(args);
      break;

    case "ls":
      await require("./commands/ls")(args);
      break;

    case "report-md":
      await require("./commands/report-md")(args);
      break;

    case "schedule":
      await require("./commands/schedule")(args);
      break;

    case "today":
      await require("./commands/today")(args);
      break;

    case "todo":
      await require("./commands/todo")(args);
      break;

    case "version":
      await require("./commands/version")(args);
      break;

    default:
      errorExit(`"${cmd}" is not a valid command`);
      break;
  }
};
 
export default index();
