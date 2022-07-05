import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const dbFileName = 'tasks.json';
const projectDbPath = '.ultiplan';

@Injectable()
export class TasksService {
  delete(): any {
    console.log(`------------------------------------`);
    console.log(`deleteRecord`);
  }

  create(): any {
    console.log(`------------------------------------`);
    console.log(`createRecord`);
  }

  readRaw(): any {
    console.log(`------------------------------------`);
    console.log(`readRecords`);

    try {
      const ultiplanProject: string = process.env.ultiplanProject;
      const handle = path.join(ultiplanProject, projectDbPath, dbFileName);
      console.log(handle);
      if (!fs.existsSync(handle)) {
        console.error(`${handle} not found`);
        return [];
      }
      return fs.readFileSync(handle, 'utf-8');
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  read(): any {
    return JSON.parse(this.readRaw());
  }
}
