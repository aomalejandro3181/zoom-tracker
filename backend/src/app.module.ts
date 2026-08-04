import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaquetesModule } from './paquetes/paquetes.module';

function getDatabasePort(configService: ConfigService): number {
  const port = configService.get('DB_PORT');
  return port ? parseInt(port as string, 10) : 5432;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: getDatabasePort(configService),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false, // no usar en prod
      }),
    }),
    PaquetesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
