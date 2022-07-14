import * as dotenv from 'dotenv';
dotenv.config({path: '.env'});
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        })
    );
    app.setGlobalPrefix('api');
    await app.listen(process.env.SERVER_PORT);
}
bootstrap();
