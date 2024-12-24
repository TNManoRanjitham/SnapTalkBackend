import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow the frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
