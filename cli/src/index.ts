import errorExit from "libs/src/utils/error-exit";
import { getAndCheckDbHandle } from "libs/src/db/db-util";
 
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
  const ignoreInvalidHandle = cmd === `init` || cmd === `help` || cmd === `version` || cmd === `create-samples`;
  if (!handle && !ignoreInvalidHandle) errorExit(info);
 
  // generated command handlers
  switch (cmd) {
    case "add":
      await require("./commands/add")(handle);
      break;

    case "check":
      await require("./commands/check")(handle);
      break;

    case "create-samples":
      await require("./commands/create-samples")(handle);
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

    case "mv":
      await require("./commands/mv")(handle);
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

    case "version":
      await require("./commands/version")(handle);
      break;

    default:
      errorExit(`"${cmd}" is not a valid command`);
      break;
  }
};
 
export default index();
