import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
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
  getTasks(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.appService.getTasksAsJSON());
    return res;
  }

  // @Get()
  // getTasks(): string {
  //   return this.appService.getTasksAsString();
  // }
}
