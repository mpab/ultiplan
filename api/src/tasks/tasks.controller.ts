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
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

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
  @ApiOkResponse({ description: `task deleted.` })
  @ApiNotFoundResponse({ description: 'task not found.' })
  delete(@Param('id') id: string): void {
    this.service.delete(id);
  }

  @Post()
  create(@Body() model: TaskModel): any {
    //res.status(HttpStatus.OK).json(this.service.create());
    return this.service.create(model);
  }

  @Put()
  update(@Body() model: TaskModel): any {
    //res.status(HttpStatus.OK).json(this.service.create());
    try {
      this.service.update(model);
    } catch (e) {}
  }
}
