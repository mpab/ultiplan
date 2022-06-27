import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

const filePath = './../.ultiplan/tasks.json';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTasksAsJSON(): any {
    const [handle] = [filePath]; //getAndCheckDbHandle(dir);
    if (!handle) return [];
    const json = readFileSync(handle, 'utf-8');
    return JSON.parse(json);
  }

  getTasksAsString(): string {
    const [handle] = [filePath]; //getAndCheckDbHandle(dir);
    if (!handle) JSON.stringify([], null, '  ');
    const json = readFileSync(handle, 'utf-8');
    return json;
  }
}
