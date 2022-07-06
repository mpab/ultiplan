import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskModel } from './task.interface';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  get(): any {
    return this.service.read();
  }

  @Get(':id')
  find(@Param('id') id: string): any {
    return this.service.find(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): any {
    return this.service.delete(id);
  }

  @Post()
  create(@Body() model: TaskModel): any {
    //res.status(HttpStatus.OK).json(this.service.create());
    return this.service.create(model);
  }

  @Put()
  update(@Body() model: TaskModel): any {
    //res.status(HttpStatus.OK).json(this.service.create());
    return this.service.update(model);
  }
}
