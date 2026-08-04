import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('paquetes')
export class Paquete {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'codigo_guia',
        type: 'varchar',
        length: 20,
        unique: true,
        nullable: false
    })
    codigoGuia: string;

    @Column({ 
    name: 'destinatario',
    type: 'varchar', 
    length: 100, 
    nullable: false 
  })
  destinatario: string;

  @Column({ 
    name: 'ciudad_destino',
    type: 'varchar', 
    length: 60, 
    nullable: false 
  })
  ciudadDestino: string;

  @Column({ 
    name: 'peso_kg',
    type: 'decimal', 
    precision: 6, 
    scale: 2, 
    nullable: false 
  })
  pesoKg: number;

  @Column({ 
    name: 'estado',
    type: 'varchar', 
    length: 20, 
    nullable: false,
    default: 'REGISTRADO'
  })
  estado: string;

  @CreateDateColumn({ 
    name: 'creado_en',
    type: 'timestamp',
    nullable: false
  })
  creadoEn: Date;
}