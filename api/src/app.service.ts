import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { DbRecord } from '../../libs/src/db/db-record';

const dbFileName = 'tasks.json';
const projectDbPath = '.ultiplan';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  deleteRecord(record: DbRecord): any {
    console.log(`------------------------------------`);
    console.log(`deleteRecord`);
  }

  createRecord(record: DbRecord): any {
    console.log(`------------------------------------`);
    console.log(`createRecord`);
  }

  readRecords(): any {
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

  getTasksAsJSON(): any {
    return JSON.parse(this.getRecords());
  }

  getTasksAsString(): string {
    return this.getRecords();
  }
}
