const minimist = require("minimist");
const error = require("./utils/error");

const index = () => {
  const args = minimist(process.argv.slice(2));

  let cmd = args._[0] || "help";

  if (args.version || args.v) {
    cmd = "version";
  }

  if (args.help || args.h) {
    cmd = "help";
  }

  switch (cmd) {
    case "create-sample-tasks":
      require("./commands/create-sample-tasks")(args);
      break;

    case "record":
      require("./commands/record")(args);
      break;

    case "note":
      require("./commands/note")(args);
      break;

    case "track":
      require("./commands/track")(args);
      break;

    case "list-json":
      require("./commands/list-json")(args);
      break;

    case "list-csv":
      require("./commands/list-csv")(args);
      break;

    case "today":
      require("./commands/today")(args);
      break;

    case "version":
      require("./commands/version")(args);
      break;

    case "help":
      require("./commands/help")(args);
      break;

    default:
      error(`"${cmd}" is not a valid command`, true);
      break;
  }
};

export default index();
