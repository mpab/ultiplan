import path from 'path';
import fs from 'fs';

type VisitFn = (dir: string) => any;

async function* visitDirectory(visitFn: VisitFn, dir: string): any {
  for await (const d of await fs.promises.opendir(dir)) {
    if (d.isDirectory()) {
      const entry = path.join(dir, d.name);
      visitFn(entry);
      yield* await visitDirectory(visitFn, entry);
    }
  }
}

const index = async (visitFn: VisitFn, start_dir: string) => {
  for await (const p of visitDirectory(visitFn, start_dir));
};

export default index;
