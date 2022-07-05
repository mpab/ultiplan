import { Controller, Delete, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Response } from 'express';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  get(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.service.read());
    return res;
  }

  @Delete()
  delete(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.service.delete());
    return res;
  }

  @Post()
  create(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.service.create());
    return res;
  }
}
