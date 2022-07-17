import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as path from 'path';
import { DbRecord_2022_07_16, RecordView } from '../libs/db/db-record';
import { TaskModel } from './task.interface';
import dbDeleteRecord from 'src/libs/db/db-delete-record';
import dbFindRecord from 'src/libs/db/db-find-record';
import dbCreateRecord from 'src/libs/db/db-create-record';
import dateYYYYMMDD from 'src/libs/utils/dates';
import genGuid from 'src/libs/utils/generate-uuid';
import dbUpdateRecord from 'src/libs/db/db-update-record';
import {
  assignDates,
  dbLoadAsView,
  RecordDates,
  recordFromView,
  viewFromRecord,
} from 'src/libs/db/db-converters';

const projectDbPath = '.ultiplan';
const dbFileName = 'tasks.json';

const getDbHandle = (): string => {
  const ultiplanProject: string = process.env.ultiplanProject;
  return path.join(ultiplanProject, projectDbPath, dbFileName);
};

@Injectable()
export class TasksService {
  info(): string {
    const arr = process.env.ultiplanProject.replace(/\\/g, '/').split(`/`);
    return arr[arr.length - 1];
  }

  create(model: TaskModel): RecordView {
    console.log(`------------------------------------`);
    console.log(`create`);
    console.dir(model);

    if (!model.description.length) {
      throw new NotAcceptableException('Bad model.');
    }

    const dates = new RecordDates(dateYYYYMMDD(new Date()));
    const id = genGuid();

    const record: DbRecord_2022_07_16 = {
      id: id,
      description: model.description,
      tags: model.tags,
      dates: {},
    };

    assignDates(dates, record.dates);
    dbCreateRecord(record, getDbHandle());
    return viewFromRecord(record);
  }

  read(): RecordView[] {
    console.log(`------------------------------------`);
    console.log(`read`);
    const [views] = dbLoadAsView(getDbHandle());
    return views;
  }

  find(id: string): RecordView {
    console.log(`------------------------------------`);
    console.log(`find ${id}`);

    const record = dbFindRecord(id, getDbHandle());

    if (!record) {
      throw new NotFoundException('Task not found.');
    }

    return viewFromRecord(record);
  }

  update(model: TaskModel): RecordView {
    console.log(`------------------------------------`);
    console.log(`update`);
    console.dir(model);

    if (!model.description.length) {
      throw new NotAcceptableException('Bad model.');
    }

    const view: RecordView = {
      id: model.id,
      description: model.description,
      created_on: model.created_on,
      started_on: model.started_on,
      due_on: model.due_on,
      completed_on: model.completed_on,
      tags: model.tags,
    };

    const new_record = recordFromView(view);
    const changed_record = dbUpdateRecord(new_record, getDbHandle());

    if (!changed_record)
      throw new UnprocessableEntityException(`cannot update: id=${model.id}`);

    return viewFromRecord(changed_record);
  }

  delete(id: string): void {
    console.log(`------------------------------------`);
    if (!dbDeleteRecord(id, getDbHandle())) {
      throw new NotFoundException('Task not found.');
    }
    console.log(`deleted ${id}`);
  }
}
