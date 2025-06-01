import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger } from '@nestjs/common';

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit or log to a file
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exit on uncaught exceptions
});

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const protoDir = join(__dirname, 'proto');
    const protoPath = join(protoDir, 'user.proto');
    logger.log(`Attempting to load .proto file from: ${protoPath}`);
    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: protoPath,
          url: '0.0.0.0:50051', // Listen on all interfaces for Docker
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs: [protoDir]
          },
        },
      },
    );

    await app.listen().catch((error) => {
      logger.error('Error on app.listen():', error);
      process.exit(1);
    });

    // If app.listen() completed, NestJS has logged success.
    // logger.log('gRPC Microservice started successfully.'); // Or rely on Nest's internal logs

  } catch (error) {
    logger.error('Error during bootstrap:', error);
    process.exit(1);
  }
}

bootstrap();
