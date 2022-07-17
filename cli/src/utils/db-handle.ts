import path from "path";
import fs from "fs";

const db_filename = "tasks.json";
const hidden_dir = ".ultiplan";

export const getDbFilepath = (): [string, string, string] => {
  return [path.join(hidden_dir, db_filename), hidden_dir, db_filename]
}

export const safeGetDbHandle = (
  fp_root: string,
): [file_path: string, project_name: string, errors: string] => {
  const fp = path.join(fp_root, hidden_dir, db_filename);
  try {
    fs.accessSync(fp, fs.constants.F_OK);
    const path_split = fp.split(path.sep);
    const project_name = path_split[path_split.length - 3];
    return [fp, project_name, ``];
  } catch (e) {}
  return [``, ``, `invalid filepath: ` + fp];
};
