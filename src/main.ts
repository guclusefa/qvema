import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: true,
      bodyLimit: 30 * 1024 * 1024,
    }),
  );

  app.enableCors({
    origin: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', async (request, reply) => {
      reply.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept',
      );
    });

  app.setGlobalPrefix('api');

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
