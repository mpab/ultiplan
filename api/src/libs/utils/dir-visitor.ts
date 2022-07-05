import path from 'path';
import fs from 'fs';

type Visitor = (dir: string) => any;

async function* visitDirectory(visitFn: Visitor, dir: string): any {
  for await (const d of await fs.promises.opendir(dir)) {
    if (d.isDirectory()) {
      const entry = path.join(dir, d.name);
      visitFn(entry);
      yield* await visitDirectory(visitFn, entry);
    }
  }
}

const index = async (visitFn: Visitor, dir = './') => {
  for await (const p of visitDirectory(visitFn, dir));
};

export default index;
