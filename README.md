# Motores de plantillas
Desafio: Motores de plantillas

### En el directorio del proyecto, ejecutar:

### `npm i`

### Enciendo el server

### `node ./server.js`

# ENDPOINTS EJS
GET Un formulario de carga de productos en la ruta `/form`

Ruta `/productos` recibe el POST de ese formulario, y redirige al listado de `/list-productos`.

Una vista de los productos cargados (utilizando plantillas de ejs) en la ruta GET `/list-productos`.

# ENDPOINTS EXPRESS

GET `/` -> endpoint Inicial

``/agregar`` carga index de static (un form POST que responde a `/api/producto`)

GET '``/api/productos``' -> devuelve todos los productos.

GET '``/api/productosRandom``' -> Devuelve un producto al azar

GET '``/api/consulta?1clave=valor&2clave=valor``' -> devuelve la consulta.

GET '``/api/productos/:id``' -> devuelve un producto según su id.

POST '``/api/producto``' -> recibe y agrega un producto, y lo devuelve con su id asignado.

PUT '``/api/productos/:id``' -> recibe y actualiza un producto según su id.

DELETE '``/api/productos/:id``' -> elimina un producto según su id.

