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
    res.status(HttpStatus.OK).json(this.appService.read());
    return res;
  }

  @Delete()
  delete(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.appService.delete());
    return res;
  }

  @Post()
  create(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.appService.create());
    return res;
  }
}
