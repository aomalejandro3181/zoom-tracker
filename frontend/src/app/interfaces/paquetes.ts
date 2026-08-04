export interface Paquete {
  id: number;
  codigoGuia: string;
  destinatario: string;
  ciudadDestino: string;
  pesoKg: number;
  estado: string;
  creadoEn: string;
}

export interface CreatePaqueteDto {
  codigoGuia: string;
  destinatario: string;
  ciudadDestino: string;
  pesoKg: number;
  estado: string;
}

export interface UpdatePaqueteDto {
  estado: string;
}
