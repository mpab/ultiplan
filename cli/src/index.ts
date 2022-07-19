import errorExit from "./utils/error-exit";
import { safeGetDbHandle } from "./utils/db-handle";
 
const index = async () => {
  const args = require(`minimist`)(process.argv.slice(2));
  let cmd = args._[0] || `help`;
 
  if (args.version || args.v) {
    cmd = `version`;
  }
 
  if (args.help || args.h) {
    cmd = "help";
  }

  const [handle, project, errors] = safeGetDbHandle(process.cwd());
  const ignoreInvalidHandle = cmd === `init` || cmd === `help` || cmd === `version` || cmd === `create-samples`;
  if (!handle.length && !ignoreInvalidHandle) errorExit(errors);
 
  // generated command handlers
  switch (cmd) {
    case "add":
      await require("./commands/add")(handle, project);
      break;

    case "check":
      await require("./commands/check")(handle, project);
      break;

    case "create-samples":
      await require("./commands/create-samples")(handle, project);
      break;

    case "done":
      await require("./commands/done")(handle, project);
      break;

    case "find":
      await require("./commands/find")(handle, project);
      break;

    case "help":
      await require("./commands/help")(handle, project);
      break;

    case "init":
      await require("./commands/init")(handle, project);
      break;

    case "ls":
      await require("./commands/ls")(handle, project);
      break;

    case "report":
      await require("./commands/report")(handle, project);
      break;

    case "rm":
      await require("./commands/rm")(handle, project);
      break;

    case "schedule":
      await require("./commands/schedule")(handle, project);
      break;

    case "today":
      await require("./commands/today")(handle, project);
      break;

    case "todo":
      await require("./commands/todo")(handle, project);
      break;

    case "upschema":
      await require("./commands/upschema")(handle, project);
      break;

    case "version-app":
      await require("./commands/version-app")(handle, project);
      break;

    case "version-db":
      await require("./commands/version-db")(handle, project);
      break;

    default:
      errorExit(`"${cmd}" is not a valid command`);
      break;
  }
};
 
export default index();
