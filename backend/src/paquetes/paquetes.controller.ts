import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';
import { Paquete } from './entities/paquete.entity';
import { ESTADOS_VALIDOS_PAQUETE } from './constants/paquete.constant';

@ApiTags('Paquetes')
@Controller('api/paquetes')
export class PaquetesController {
    constructor(private readonly paquetesService: PaquetesService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener todos los paquetes' })
    @ApiQuery({ name: 'estado', required: false, description: `${ESTADOS_VALIDOS_PAQUETE.join(',')}`})
    @ApiResponse({ status: 200, description: 'Lista de paquetes obtenida exitosamente', type: [Paquete] })
  @ApiResponse({ status: 400, description: 'Estado de filtro no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async findAll(@Query('estado') estado?: string){
        try {
            return await this.paquetesService.findAll(estado);
        } catch (error) {
            console.error('Error en findAll' + error);
            if(error instanceof BadRequestException || error instanceof InternalServerErrorException){
                throw error;
            }
            throw new InternalServerErrorException('Error al obtener los paquetes');
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({transform: true}))
    async create(@Body() createPaqueteDto: CreatePaqueteDto){
        try {
            return await this.paquetesService.create(createPaqueteDto)
        } catch (error) {
            console.error('Error en create:', error);
      
            if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
                throw error;
            }
            
            throw new InternalServerErrorException('Error al crear paquete');
                }
    }

    @Patch(':id/estado')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({transform: true}))
    async updateEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePaqueteDto: UpdatePaqueteDto
    ){
        try {
            return await this.paquetesService.updateEstado(id, updatePaqueteDto)
        } catch (error) {
        console.error('Error en updateEstado:', error);
      
        if (error instanceof BadRequestException || 
            error instanceof NotFoundException || 
            error instanceof InternalServerErrorException) {
            throw error;
        }
        
        throw new InternalServerErrorException('Error al actualizar estado del paquete');
        }
    }
}
