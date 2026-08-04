import { BadRequestException } from '@nestjs/common';
import { ESTADOS_VALIDOS_PAQUETE, EstadoPaquete } from '../constants/paquete.constant';

export function validarEstadoPaquetes (estado: string){
    if(!isEstadoValiddo(estado)){
        throw new BadRequestException(
            `Estado no valido. Valores permitidos: ${ESTADOS_VALIDOS_PAQUETE.join(',')}`
        )
    }

    return estado as EstadoPaquete; 
}

export function isEstadoValiddo(estado: string): boolean{
    return ESTADOS_VALIDOS_PAQUETE.includes(estado as EstadoPaquete);
}
