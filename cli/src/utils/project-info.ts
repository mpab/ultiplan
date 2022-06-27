// project information

export interface ProjectInfo {
  name: string
}

module.exports = (): ProjectInfo => {
  const path = require("path");
  return {
    name: process.cwd().split(path.sep).pop() as string
  };
};
