import { Injectable } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import * as path from 'path';

const dbFileName = 'tasks.json';
const projectDbPath = '.ultiplan';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getRecords(): any {
    console.log(`------------------------------------`);
    console.log(`getRecords`);

    try {
      const utiliplanProject: string = process.env.utiliplanProject;
      const handle = path.join(utiliplanProject, projectDbPath, dbFileName);
      console.log(handle);
      if (!existsSync(handle)) {
        console.error(`${handle} not found`);
        return [];
      }
      return readFileSync(handle, 'utf-8');
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
