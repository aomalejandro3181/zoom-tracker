
# ZOOM - Seguimiento de Paquetes

Mini-módulo interno para que un operador registre y dé seguimiento al estado de paquetes de encomienda.

## Stack Tecnológico

- **Backend**: Node.js con NestJS v11, TypeORM, PostgreSQL
- **Frontend**: Angular (standalone components), TypeScript
- **Base de Datos**: PostgreSQL
- **Package Manager**: pnpm
- **Control de Versiones**: Git
- **Documentación**: Swagger UI

## Requisitos Previos

- Node.js v18+
- pnpm
- PostgreSQL
- Git

## Instalación

### Backend

1. Navegar al directorio backend:
   ```bash
   cd backend

2. Instalar dependencias:
    ```bash
   pnpm install
3. Configurar variables de entorno:
Copiar `ejemplo.env` a `.env`
Configurar credenciales de PostgreSQL
Asegurarse de tener la base de datos zoom_tracker creada.

4. Ejecutar el backend:
```bash
   pnpm run start:dev
````
### Frontend

1. Navegar al directorio frontend:
 ```bash
   cd frontend
````
2. Instalar dependencias
```bash
   pnpm install
````
3. Ejecutar el frontend:
```bash
   pnpm start
````

### Scripts SQL
Creación de base de datos y tabla
Archivo: `sql/schema.sql`
```bash
-- Crear la base de datos
DROP DATABASE IF EXISTS zoom_tracker;
CREATE DATABASE zoom_tracker;


-- Crear la tabla paquetes
CREATE TABLE paquetes (
    id SERIAL PRIMARY KEY,
    codigo_guia VARCHAR(20) NOT NULL UNIQUE,
    destinatario VARCHAR(100) NOT NULL,
    ciudad_destino VARCHAR(60) NOT NULL,
    peso_kg NUMERIC(6,2) NOT NULL CHECK (peso_kg > 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'REGISTRADO',
    -- estado esperado: REGISTRADO, EN_TRANSITO, ENTREGADO, DEVUELTO
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO paquetes (codigo_guia, destinatario, ciudad_destino, peso_kg, estado) VALUES
('ZM-4417', 'Simon Bolivar', 'Caracas', 7.56, 'EN_TRANSITO'),
('ZM-4419', 'Fransico de Miranda', 'Valencia', 3.5, 'REGISTRADO'),
('ZM-4489', 'Andrés Bello', 'Maracaibo', 27.9, 'ENTREGADO'),
('ZM-4456', 'Pedro Camejo', 'Merida', 2.1, 'DEVUELTO'),
('ZM-4490', 'José Maria', 'Caracas', 15.3, 'EN_TRANSITO'),
('ZM-4476', 'Maria Bolvar', 'Sucre', 35.7, 'ENTREGADO'),
('ZM-4400', 'Antonio Sucre', 'Aragua', 12.75, 'REGISTRADO'),
('ZM-4499', 'Arturo Michelena', 'Ciudad Bolivar', 35.7, 'DEVUELTO');
```
### Consultas avanzadas
Archivo: `sql/consultas.sql`

```bash
-- Cantidad de paquetes agrupados por estado, ordenado de mayor a menor cantidad
SELECT 
    estado,
    COUNT(*) as cantidad
FROM paquetes
GROUP BY estado
ORDER BY cantidad DESC;

-- Ciudad de destino con mayor peso total acumulado (suma de peso_kg), junto con ese total
SELECT 
    ciudad_destino,
    SUM(peso_kg) as peso_total
FROM paquetes
GROUP BY ciudad_destino
ORDER BY peso_total DESC
LIMIT 1;

-- Listado de paquetes 'REGISTRADO' con más de 24 horas de antigüedad (usando creado_en), ordenados del más antiguo al más reciente
SELECT *
FROM paquetes
WHERE estado = 'REGISTRADO' 
AND creado_en < NOW() - INTERVAL '24 hours'
ORDER BY creado_en ASC;

/* Explique en un comentario dentro del mismo archivo: si esta tabla creciera a 5 millones de filas y la
consulta del punto 3 se ejecutara constantemente, ¿qué índice(s) crearía y por qué?

- Primero crearía indices en 'estado' y 'creado_en' esto optimiza la consulta usando el WHERE estado = 'REGISTRADO' y el rango,
No habría problemas al suar el ORDER BY

- Luego creo otro indice solo con 'estado' esto ya optimiza el filtrado en la consulta en general

 hacer el indice combinado 'estado y creado_en' funciona super veloz al momento de encontrar todos los registros
 por ejemplo con estado = 'REGISTRADO' y luego aplicando la condición del tiempo mas el ordenamiento, el costo de recurso y menor!

*/
```

## API Endpoints
### Backend - API REST
- `GET /api/paquetes` - Listar paquetes (con filtro opcional por estado vía query param `?estado=ENTREGADO`)
- `POST /api/paquetes` - Crear un paquete
- `PATCH /api/paquetes/:id/estado` - Actualiza únicamente el estado de un paquete

### Frontend - Angular
- Formulario reactivo para crear nuevos paquetes
- Tabla con listado de paquetes
- Selector para cambiar estado directamente en la tabla
- Feedback visual de éxito/error
- Consumo de API REST con manejo de errores

## Características Técnicas
### Backend
- API REST con NestJS
- Validaciones con class-validator
- Manejo de errores consistente
- Conexión PostgreSQL con TypeORM
- Documentación con Swagger UI en `/api`
- Consultas parametrizadas para evitar SQL Injection
- Separación de capas: controladores, servicios, entidades
- Variables de entorno para configuración

### Frontend
- Componentes standalone de Angular
- Formularios reactivos con validaciones
- Tipado TypeScript completo
- Servicio HTTP dedicado a llamadas API
- Manejo de errores en el cliente
- Retroalimentación visual al usuario

## Estructura del Proyecto
```bash
zoom-tracker/
├── backend/                 # Backend con NestJS
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── paquetes/        # Módulo de paquetes
│   │       ├── entities/
│   │       ├── dto/
│   │       ├── constants/
│   │       ├── utils/
│   │       ├── paquetes.module.ts
│   │       ├── paquetes.service.ts
│   │       └── paquetes.controller.ts
│   ├── .env
│   ├── sample.env
│   └── package.json
├── frontend/               # Frontend con Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   ├── components/
│   │   │   │   └── tracking/
│   │   │   ├── interfaces/
│   │   │   └── services/
│   │   ├── environments/
│   │   └── index.html
│   └── package.json
├── sql/                   # Scripts SQL
│   ├── schema.sql
│   └── consultas.sql
├── .gitignore
└── README.md
````
### Decisiones
- Uso de TypeORM para abstraer la lógica de base de datos
- Separación clara de responsabilidades (controladores, servicios, entidades)
- Validaciones tanto en frontend como backend
- Uso de constantes para estados válidos
- Funciones de utilidad para validaciones reutilizables
- Variables de entorno para configuración segura
- Documentación de API con Swagger
- Manejo de errores con try-catch en servicios
- Consultas parametrizadas para seguridad

### Qué Haría Distinto con Más Tiempo?
- Implementar autenticación y autorización
- Agregar tests unitarios e integración
- Implementar paginación para grandes volúmenes de datos
- Agregar logs estructurados
- Implementar cacheo con Redis
- Agregar validaciones más complejas en el frontend
- Mejorar la UI/UX con un framework CSS
- Implementar pruebas end-to-end