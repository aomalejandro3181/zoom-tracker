import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Paquete } from './entities/paquete.entity';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';
import { validarEstadoPaquetes } from './utils/paquete.utils';


@Injectable()
export class PaquetesService {

    constructor(
        @InjectRepository(Paquete)
        private paqueteRepository: Repository<Paquete>,
    ){}

    async findAll(estado?: string){
        try {
            const queryBuilder = this.paqueteRepository.createQueryBuilder('paquete');
    
            if(estado) {
                queryBuilder.where('paquete.estado = :estado', {estado});
            }
    
            return await queryBuilder.getMany();
        } catch (error) {
            console.error('Error en findAll:', error);
            throw new InternalServerErrorException('Error al obtener paquetes');
        }
    }

    async findOne(id: number){
        try {
            const paquete = await this.paqueteRepository.findOneBy({ id });

            if(!paquete) {
                throw new NotFoundException(`Pquete con ID ${id} no encontrado`);
            }

            return paquete;
            
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error;
            }

            console.error('Error en findOne:', error);
            throw new InternalServerErrorException('Error al obtene el paquete');
        }
    }

    async create(createPaqueteDto: CreatePaqueteDto){
        try {
            validarEstadoPaquetes(createPaqueteDto.estado);

            // Varificar si hay un codigo de guia duplicado
            const existingPaquete = await this.paqueteRepository.findOne({
                where: { codigoGuia: createPaqueteDto.codigoGuia},
            })

            if(existingPaquete) {
                throw new BadRequestException('El código de guía ya existe!')
            }
            const paquete = this.paqueteRepository.create(createPaqueteDto)

            return await this.paqueteRepository.save(paquete);

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            if( error instanceof QueryFailedError){
                // si fue por duplicado
                if(error.message.includes('duplicate key')){
                    throw new BadRequestException('El código de guía ya existe');
                }
                console.error('Error de base de datos en create:', error);
                throw new InternalServerErrorException('Error en la base de datos');
            }

            console.error('Error en create:', error);
            throw new InternalServerErrorException('Error al crear paquete');
        }
    }

    async  updateEstado(id: number, updatePaqueteDto: UpdatePaqueteDto) {

        try {

            const paquete = await this.findOne(id);

            // validar estado si existe
            validarEstadoPaquetes(updatePaqueteDto.estado)

            paquete.estado = updatePaqueteDto.estado;

            return await this.paqueteRepository.save(paquete)
            
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            
            console.error('Error en updateEstado:', error);
            throw new InternalServerErrorException('Error al actualizar estado del paquete');
        }
        
    }
}
