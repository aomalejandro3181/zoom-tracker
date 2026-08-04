import { IsString, IsNotEmpty, IsNumber, Min, MaxLength, Validate, IsIn } from 'class-validator';
import { ESTADOS_VALIDOS_PAQUETE } from '../constants/paquete.constant';

export class CreatePaqueteDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    codigoGuia: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    destinatario: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    ciudadDestino: string;

    @IsNumber()
    @Min(0.01)
    pesoKg: number;

    @IsString()
    @IsNotEmpty()
    @IsIn(ESTADOS_VALIDOS_PAQUETE)
    estado: string;

}