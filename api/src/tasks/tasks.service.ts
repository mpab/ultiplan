import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
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
import dbUpdateRecord from 'src/libs/db/db-update-record';

const projectDbPath = '.ultiplan';
const dbFileName = 'tasks.json';

const getDbHandle = (): string => {
  const ultiplanProject: string = process.env.ultiplanProject;
  return path.join(ultiplanProject, projectDbPath, dbFileName);
};

const getProjectName = (): string => {
  const arr = process.env.ultiplanProject.replace(/\\/g, '/').split(`/`);
  return arr[arr.length - 1];
};

@Injectable()
export class TasksService {
  create(model: TaskModel): DbRecord {
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
      tags: model.tags,
    };

    dbCreateRecord(record, getDbHandle());

    return record;
  }

  read(): DbRecord[] {
    console.log(`------------------------------------`);
    console.log(`read`);
    return dbLoad(getDbHandle());
  }

  find(id: string): DbRecord {
    console.log(`------------------------------------`);
    console.log(`find ${id}`);

    const record = dbFindRecord(id, getDbHandle());

    if (!record) {
      throw new NotFoundException('Task not found.');
    }

    return record;
  }

  update(model: TaskModel): DbRecord {
    console.log(`------------------------------------`);
    console.log(`update`);
    console.dir(model);

    if (!model.description.length) {
      throw new NotAcceptableException('Bad model.');
    }

    const record: DbRecord = {
      id: model.id,
      description: model.description,
      created_on: model.created_on,
      started_on: model.started_on,
      due_on: model.due_on,
      completed_on: model.completed_on,
      project: model.project,
      tags: model.tags,
    };

    if (!dbUpdateRecord(record, getDbHandle()))
      throw new UnprocessableEntityException(`cannot update: id=${model.id}`);

    return record;
  }

  delete(id: string): void {
    console.log(`------------------------------------`);
    if (!dbDeleteRecord(id, getDbHandle())) {
      throw new NotFoundException('Task not found.');
    }
    console.log(`deleted ${id}`);
  }
}
