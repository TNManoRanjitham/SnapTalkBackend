import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Allow the frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Snap Talk')
    .setDescription('This is a simple API for demonstration purposes')
    .setVersion('1.0')
    .addTag('greet')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Save Swagger JSON to a file
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api-docs', app, document);

   // Apply the global JWT guard
   app.useGlobalGuards(new JwtAuthGuard());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
