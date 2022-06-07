import errorExit from "./utils/error-exit";
import { getAndCheckDbHandle } from "./db/db-util";
 
const index = async () => {
  const args = require(`minimist`)(process.argv.slice(2));
  let cmd = args._[0] || `help`;
 
  if (args.version || args.v) {
    cmd = `version`;
  }
 
  if (args.help || args.h) {
    cmd = "help";
  }

  const [handle, info] = getAndCheckDbHandle();
  const ignoreInvalidHandle = cmd === `init` || cmd === `help` || cmd === `version`;
  if (!handle && !ignoreInvalidHandle) errorExit(info);
 
  // generated command handlers
  switch (cmd) {
    case "create-sample-tasks":
      await require("./commands/create-sample-tasks")(handle);
      break;

    case "done":
      await require("./commands/done")(handle);
      break;

    case "help":
      await require("./commands/help")(handle);
      break;

    case "init":
      await require("./commands/init")(handle);
      break;

    case "ls":
      await require("./commands/ls")(handle);
      break;

    case "report":
      await require("./commands/report")(handle);
      break;

    case "schedule":
      await require("./commands/schedule")(handle);
      break;

    case "today":
      await require("./commands/today")(handle);
      break;

    case "todo":
      await require("./commands/todo")(handle);
      break;

    case "todo2":
      await require("./commands/todo2")(handle);
      break;

    case "version":
      await require("./commands/version")(handle);
      break;

    default:
      errorExit(`"${cmd}" is not a valid command`);
      break;
  }
};
 
export default index();
