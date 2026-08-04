import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ESTADOS_VALIDOS_PAQUETE } from '../constants/paquete.constant';

export class UpdatePaqueteDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(ESTADOS_VALIDOS_PAQUETE)
    estado: string;
}