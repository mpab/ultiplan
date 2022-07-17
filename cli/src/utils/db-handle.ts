import path from "path";
import fs from "fs";

const dbFileName = "tasks.json";
const projectDbPath = ".ultiplan";

export const safeGetDbHandle = (
  fp_root: string,
): [file_path: string, project_name: string, errors: string] => {
  const fp = path.join(fp_root, projectDbPath, dbFileName);
  try {
    fs.accessSync(fp, fs.constants.F_OK);
    const path_split = fp.split(path.sep);
    const project_name = path_split[path_split.length - 3];
    return [fp, project_name, ``];
  } catch (e) {}
  return [``, ``, `invalid filepath: ` + fp];
};
