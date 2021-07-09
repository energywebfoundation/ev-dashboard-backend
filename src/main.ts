import { NestFactory } from '@nestjs/core';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('EV Dashboard'),
      ),
      transports: [new winston.transports.Console()],
    }),
  });
  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();
