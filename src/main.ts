import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Configurations
  process.env.SECRET_FOR_ENCRYPT = 'secretKey';

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
