async function* visitDirectory (dir: string, visit: (filePath: string) => any, getFilePath: (dirPath: string) => [handle: string, info: string]): any {
  const fs = require("fs");
  const path = require("path");
  for await (const d of await fs.promises.opendir(dir)) {
    if (d.isDirectory()) {
      
      const entry = path.join(dir, d.name);
      const [handle, _] = getFilePath(entry);
      if (handle) {
        visit(handle);
      }

      yield* await visitDirectory(entry, visit, getFilePath);
    }
  }
}

module.exports =
  async (visit: (filePath: string) => any, getFilePath: (dirPath: string) => [handle: string, info: string], dir: string = "./") => {
  for await (const p of visitDirectory(dir, visit, getFilePath));
}
