import { Injectable } from '@nestjs/common';

import { readFileSync } from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTasks(): string {
    const [handle] = ['./../.ultiplan/tasks.json']; //getAndCheckDbHandle(dir);
    if (!handle) return '';
    const json = readFileSync(handle, 'utf-8');
    return json;
  }
}
