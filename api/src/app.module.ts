import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { HelloModule } from './hello/hello.module';
import { TasksController } from './tasks/tasks.controller';
import { HelloController } from './hello/hello.controller';
import { TasksService } from './tasks/tasks.service';
import { HelloService } from './hello/hello.service';

@Module({
  imports: [ConfigModule.forRoot(), TasksModule, HelloModule],
  controllers: [TasksController, HelloController],
  providers: [TasksService, HelloService],
})
export class AppModule {}
