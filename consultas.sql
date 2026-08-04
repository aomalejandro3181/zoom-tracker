-- Cantidad de paquetes agrupados por estado, ordenado de mayor a menor cantidad

SELECT estado, count(*) AS cantidad FROM public.paquetes
GROUP BY estado
ORDER BY cantidad DESC;

-- Ciudad de destino con mayor peso total acumulado (suma de peso_kg), junto con ese total

select ciudad_destino, sum(peso_kg) as peso_total from public.paquetes
group by ciudad_destino
order by peso_total DESC
LIMIT 1;

-- Listado de paquetes 'REGISTRADO' con más de 24 horas de antigüedad (usando creado_en), ordenados del más antiguo al más recientes

select * from public.paquetes
where estado = 'REGISTRADO' AND creado_en < NOW() - INTERVAL '24 hours'
ORDER BY creado_en ASC

/* Explique en un comentario dentro del mismo archivo: si esta tabla creciera a 5 millones de filas y la
consulta del punto 3 se ejecutara constantemente, ¿qué índice(s) crearía y por qué?

- Primero crearía indices en 'estado' y 'creado_en' esto optimiza la consulta usando el WHERE estado = 'REGISTRADO' y el rango,
No habría problemas al suar el ORDER BY

- Luego creo otro indice solo con 'estado' esto ya optimiza el filtrado en la consulta en general

 hacer el indice combinado 'estado y creado_en' funciona super veloz al momento de encontrar todos los registros
 por ejemplo con estado = 'REGISTRADO' y luego aplicando la condición del tiempo mas el ordenamiento, el costo de recurso y menor!

*/