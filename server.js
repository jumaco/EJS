const express = require('express');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const Contenedor = require('./api');
const contenedor = new Contenedor('./productos.json');

const server = express();
const PORT = 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/agregar', express.static('public'));

const httpServer = new HttpServer(server)
const io = new IOServer(httpServer)


// ------------------------------------------------------------------------------------------------------------------------------------

//############################### SOCKET.IO ###################################

// INDICAMOS QUE QUEREMOS CARGAR LOS ARCHIVOS ESTÁTICOS QUE SE ENCUENTRAN EN DICHA CARPETA
server.use(express.static('./public/io'))

// ESTA RUTA CARGA NUESTRO ARCHIVO INDEX.HTML EN LA RAÍZ DE LA MISMA
server.get('/chat', (req, res) => {
	res.sendFile('./public/chat.html', { root: __dirname })
})

// server.get('/form-io', (req, res) => {
//     res.sendFile('./public/form-io.html', { root: __dirname })
// })

// EL SERVIDOR FUNCIONANDO EN EL PUERTO 3000
httpServer.listen(3000, () => console.log('SERVER SOCKET.IO ON en http://localhost:3000'))

//...
io.on('connection', (socket) => {

	// "CONNECTION" SE EJECUTA LA PRIMERA VEZ QUE SE ABRE UNA NUEVA CONEXIÓN
	console.log(`Usuario conectado ${socket.id}`)

	// SE IMPRIMIRÁ SOLO LA PRIMERA VEZ QUE SE HA ABIERTO LA CONEXIÓN
	socket.emit('mi mensaje', 'Este es mi mensaje desde el servidor')

	// ESCUCHA EL SERVIDOR AL CLIENTE
	socket.on('notificacion', data => {
		console.log(data)
	})

	/*ESCUCHO LOS MENSAJES ENVIADOS POR EL CLIENTE Y SE LOS PROPAGO A TODOS*/
	socket.on('mensaje', data => {
		mensajes.push({ socketid: socket.id, mensaje: data })
		io.sockets.emit('mensajes', mensajes);
	})

	// SE IMPRIMIRÁ SOLO CUANDO SE CIERRE LA CONEXIÓN
	socket.on('disconnect', () => {
		console.log(`Usuario desconectado ${socket.id}`);
	});

	/*ESCUCHO LOS MENSAJES CHAT ENVIADOS*/
	socket.on('chat message', (msg) => {
		console.log(`message: ${msg}`);
	});

	//DIFUSIÓN
	socket.on('chat message', (msg) => {
		io.emit('chat message', msg);
	});

	//CARGA DE PRUDUCTO MEDIANTE SOCKET.IO
	socket.on('new-product', async product => {
		await contenedor.save(product);
		const productos = await contenedor.getAll();

		io.sockets.emit('products', {
			productos: productos,
			hayProductos: productos.length
		});
	})
})



//############################### EJS ###################################
server.set('views', './views');
server.set('view engine', 'ejs');

// ENDPOINTS EJS

// GET UN FORMULARIO DE CARGA DE PRODUCTOS EN LA RUTA ‘/form’
server.get('/form', (req, res) => {
	res.render("./pages/formularioPost");
});

// POST
// (configurar la ruta '/productos' PARA RECIBIR EL POST DE ESE FORMULARIO, Y REDIRIGIR AL LISTADO DE /list-productos).
server.post('/productos', async (req, res) => {
	await contenedor.save(req.body)
	res.redirect('/list-productos');
});

// GET
// UNA VISTA DE LOS PRODUCTOS CARGADOS (UTILIZANDO PLANTILLAS DE EJS) EN LA RUTA GET '/list-productos'.
server.get('/list-productos', async (req, res) => {
	const productos = await contenedor.getAll();
	res.render("./pages/listadoDeProductos", {
		productos: productos,
		hayProductos: productos.length
	});
});
// AMBAS PÁGINAS CONTARÁN CON UN BOTÓN QUE REDIRIJA A LA OTRA.

//############################### EJS para SOCKET.IO ###################################

// GET UN FORMULARIO DE CARGA DE PRODUCTOS EN LA RUTA ‘/form-io’
server.get('/form-io', async (req, res) => {
	const productos = await contenedor.getAll();
	res.render("./pages/formularioIo", {
		productos: productos,
		hayProductos: productos.length
	});
});

//############################### FIN EJS ###################################

// ENDPOINTS EXPRESS

// GET '/' -> ENDPOINT INICIAL
const PATH = '/';
const callback = (request, response, next) => {
	response.send({ mensaje: 'HOLA MUNDO! Dirigete a /form para usar EJS; /agregar para usar static' });
};
server.get(PATH, callback);

// GET '/api/productos' -> DEVUELVE TODOS LOS PRODUCTOS.
server.get('/api/productos', async (req, res) => {
	const productos = await contenedor.getAll();
	res.json(productos);
});

// GET '/api/productosRandom' -> DEVUELVE UN PRODUCTO AL AZAR
server.get('/api/productosRandom', async (req, res) => {
	const producto = await contenedor.getRandom();
	res.json(producto);
});

// GET '/api/consulta?1clave=valor&2clave=valor' -> DEVUELVE LA CONSULTA.
server.get('/api/consulta', (req, res) => {
	console.log(req.query)
	res.send(req.query)
});

// GET '/api/productos/:id' -> DEVUELVE UN PRODUCTO SEGÚN SU ID.
server.get('/api/productos/:id', async (req, res) => {
	const id = Number(req.params.id)
	const producto = await contenedor.getById(id);
	if (!producto) {
		res.send({
			error: 'producto no encontrado'
		});
	} else {
		res.json(producto);
	}
});

// POST '/api/producto' -> RECIBE Y AGREGA UN PRODUCTO, Y LO DEVUELVE CON SU ID ASIGNADO.
server.post('/api/producto', async (req, res) => {
	await contenedor.save(req.body)
	res.send(req.body);
});

// PUT '/api/productos/:id' -> RECIBE Y ACTUALIZA UN PRODUCTO SEGÚN SU ID.
server.put('/api/productos/:id', async (req, res) => {
	const productoUpadate = await contenedor.updateById(req.body, Number(req.params.id));
	if (!productoUpadate) {
		res.send({
			error: 'producto no encontrado'
		});
	} else {
		res.send({
			message: 'success',
			data: productoUpadate
		});
	}
});

// DELETE '/api/productos/:id' -> ELIMINA UN PRODUCTO SEGÚN SU ID.
server.delete('/api/productos/:id', async (req, res) => {
	const productoDelete = await contenedor.deleteById(Number(req.params.id))
	if (!productoDelete) {
		res.send({
			error: 'producto no encontrado'
		});
	} else {
		res.send({
			message: 'Producto eliminado'
		});
	}
});


// ENCIENDO EL SERVER
const callbackInit = () => {
	console.log(`Servidor corriendo en: http://localhost:${PORT}`);
};
server.listen(PORT, callbackInit);

// MANEJO DE ERRORES
server.on("error", error => console.log(`Error en servidor ${error}`))


