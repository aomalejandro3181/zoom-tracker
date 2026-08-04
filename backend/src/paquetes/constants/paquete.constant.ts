export const ESTADOS_VALIDOS_PAQUETE = [
  'REGISTRADO',
  'EN_TRANSITO',
  'ENTREGADO',
  'DEVUELTO'
] as const;

export type EstadoPaquete = typeof ESTADOS_VALIDOS_PAQUETE[number];