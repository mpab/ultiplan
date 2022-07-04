import { Controller, Delete, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  get(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.appService.getTasksAsJSON());
    return res;
  }

  @Delete()
  delete(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.appService.deleteRecord());
    return res;
  }

  @Post()
  create(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.appService.createRecord());
    return res;
  }

  // @Get()
  // getTasks(): string {
  //   return this.appService.getTasksAsString();
  // }
}
