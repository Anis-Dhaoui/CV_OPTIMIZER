import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Without the following line DTO will never work
  // Validation pipes are used to automatically validate and transform incoming data based on the DTO (Data Transfer Object) schemas you define.
  app.useGlobalPipes(new ValidationPipe());

  // CORS is a security feature that allows your application to control which origins can access your API.
  app.enableCors(
    {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: '*',
      exposedHeaders: '*',
      credentials: true,
    }
  );

  await app.listen(3000, () => {
    Logger.log(`Server is Running at port: 3000.`)
  });
}
bootstrap();
