// project information

export interface ProjectInfo {
  name: string
}

const index = (): ProjectInfo => {
  const path = require("path");
  return {
    name: process.cwd().split(path.sep).pop() as string
  };
};

export default index;
