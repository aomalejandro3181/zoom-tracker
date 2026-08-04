-- crear DB
DROP DATABASE IF EXISTS zoom_tracker;
CREATE DATABASE zoom_tracker;
USE zoom_tracker;


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

-- INSERTS
INSERT INTO paquetes (codigo_guia, destinatario, ciudad_destino, peso_kg, estado) VALUES
('ZM-4417', 'Simon Bolivar', 'Caracas', 7.56, 'EN_TRANSITO'),
('ZM-4419', 'Fransico de Miranda', 'Valencia', 3.5, 'REGISTRADO'),
('ZM-4489', 'Andrés Bello', 'Maracaibo', 27.9, 'ENTREGADO'),
('ZM-4456', 'Pedro Camejo', 'Merida', 2.1, 'DEVUELTO'),
('ZM-4490', 'José Maria', 'Caracas', 15.3, 'EN_TRANSITO'),
('ZM-4476', 'Maria Bolvar', 'Sucre', 35.7, 'ENTREGADO'),
('ZM-4400', 'Antonio Sucre', 'Aragua', 12.75, 'REGISTRADO'),
('ZM-4476', 'Arturo Michelena', 'Ciudad Bolivar', 35.7, 'DEVUELTO'),