import { Module } from '@nestjs/common';
import { PaquetesController } from './paquetes.controller';
import { PaquetesService } from './paquetes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paquete } from './entities/paquete.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paquete])],
  controllers: [PaquetesController],
  providers: [PaquetesService],
  exports: [PaquetesModule]
})
export class PaquetesModule {}
