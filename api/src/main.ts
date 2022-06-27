import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = 3001;
  await app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}/api`);
  });
}
bootstrap();

