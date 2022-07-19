// show the db version

import stringIsNullOrEmptyOrWhitespace from "ultiplan-api/src/libs/utils/string-is-null-or-empty-or-whitespace";
import { dbLoadGeneric } from "ultiplan-api/src/libs/db/db-load";
import { safeGetDbHandle } from "../utils/db-handle";
import visit from "../utils/dir-visitor";

const removeProps = (o: any, props: string[]) => {
  for (const i of props) {
    delete o[i];
  }
};

const getExtraProps = (o: any, props: string[]): string[] => {
  removeProps(o, props);

  const ret: string[] = [];
  Object.keys(o).forEach((key) => ret.push(key));
  return ret;
};

const getMissingProps = (o: any, props: string[]): string[] => {
  return props.filter((prop) => o[prop] === undefined);
};

const checkVersion = (handle: string) => {
  if (stringIsNullOrEmptyOrWhitespace(handle)) return;

  let missing: string[];
  let extra: string[];

  let [objects, error] = dbLoadGeneric<Object>(handle);
  if (error) return;
  let fail_2022_05_01 = 0;
  for (const idx in objects) {
    missing = getMissingProps(objects[idx], [
      `id`,
      `description`,
      `created_on`,
      `tags`,
    ]);
    extra = getExtraProps(objects[idx], [
      `id`,
      `description`,
      `created_on`,
      `started_on`,
      `due_on`,
      `completed_on`,
      `tags`,
    ]);
    fail_2022_05_01 += missing.length || extra.length;
  }

  if (!fail_2022_05_01) {
    console.log(`v2022_05_01`);
  }

  [objects, error] = dbLoadGeneric<Object>(handle);
  if (error) return;
  let fail_2022_07_16 = 0;
  for (const idx in objects) {
    missing = getMissingProps(objects[idx], [
      `id`,
      `description`,
      `dates`,
      `tags`,
    ]);
    extra = getExtraProps(objects[idx], [`id`, `description`, `dates`, `tags`]);
    fail_2022_07_16 += missing.length || extra.length;
  }

  if (!fail_2022_07_16) {
    console.log(`v2022_07_16`);
  }
};

module.exports = async (handle: string) => {
  const minimist = require(`minimist`);
  const args = minimist(process.argv.slice(2));

  checkVersion(handle);

  if (args.r || args.recurse) {
    await visit((dir: string) => {
      const [file_handle] = safeGetDbHandle(dir);
      if (!file_handle.length) return;
      checkVersion(handle);
    }, process.cwd());
    return;
  }
};
