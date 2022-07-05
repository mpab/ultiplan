import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import { DbRecord, DbRecordDates } from '../libs/db/db-record';
import dbLoad from '../libs/db/db-load';
import { TaskModel } from './task.interface';
import dbDeleteRecord from 'src/libs/db/db-delete-record';
import dbFindRecord from 'src/libs/db/db-find-record';
import dbCreateRecord from 'src/libs/db/db-create-record';
import dateYYYYMMDD from 'src/libs/utils/dates';
import genGuid from 'src/libs/utils/generate-uuid';

const projectDbPath = '.ultiplan';
const dbFileName = 'tasks.json';

const getDbHandle = (): string => {
  const ultiplanProject: string = process.env.ultiplanProject;
  return path.join(ultiplanProject, projectDbPath, dbFileName);
};

const getProjectName = (): string => {
  const arr = process.env.ultiplanProject.replace(/\\/g, "/").split(`/`);
  return arr[arr.length -1];
}

@Injectable()
export class TasksService {
  create(model: TaskModel): any {
    console.log(`------------------------------------`);
    console.log(`create`);
    console.dir(model);

    if (!model.description.length) {
      throw new NotAcceptableException('Bad model.');
    }

    const date = dateYYYYMMDD(new Date());
    const dates: DbRecordDates = {
      created_on: date,
      started_on: '',
      due_on: '',
      completed_on: '',
    };

    const id = genGuid();

    const record: DbRecord = {
      id: id,
      description: model.description,
      created_on: dates.created_on,
      started_on: dates.started_on,
      due_on: dates.due_on,
      completed_on: dates.completed_on,
      project: getProjectName(),
      tags: [],
    };

    dbCreateRecord(record, getDbHandle());
  }

  read(): any {
    console.log(`------------------------------------`);
    console.log(`read`);
    return dbLoad(getDbHandle());
  }

  find(id: string): any {
    console.log(`------------------------------------`);
    console.log(`find ${id}`);

    const record = dbFindRecord(id, getDbHandle());

    if (!record) {
      throw new NotFoundException('Task not found.');
    }

    return record;
  }

  delete(id: string): any {
    console.log(`------------------------------------`);
    console.log(`delete ${id}`);
    if (!dbDeleteRecord(id, getDbHandle())) {
      throw new NotFoundException('Task not found.');
    }
  }
}
