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
  @ApiOkResponse({ description: `tasks found.` })
  @ApiNotFoundResponse({ description: 'tasks not found.' })
  get(): any {
    return this.service.read();
  }

  @Get(':id')
  @ApiOkResponse({ description: `task found.` })
  @ApiNotFoundResponse({ description: 'task not found.' })
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
  @ApiOkResponse({ description: `task created.` })
  @ApiNotFoundResponse({ description: 'task not found.' })
  create(@Body() model: TaskModel): any {
    return this.service.create(model);
  }

  @Put()
  @ApiOkResponse({ description: `task updated.` })
  @ApiNotFoundResponse({ description: 'task not found.' })
  update(@Body() model: TaskModel): any {
    return this.service.update(model);
  }
}
