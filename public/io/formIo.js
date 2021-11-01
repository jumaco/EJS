const socket = io.connect();


//····················FORM·························
// CUANDO EL USUARIO ESCRIBA UN MENSAJE, EL SERVIDOR LO RECIBE COMO UN CHAT 'products' EVENTO
const form = document.getElementById('form');

form.addEventListener('submit', function (e) {
	e.preventDefault();
	let title = document.getElementById('nombre').value;
	let price = document.getElementById('precio').value;
	let thumbnail = document.getElementById('foto').value;
	socket.emit('new-product', { title, price, thumbnail });
	title.value = '';
	price.value = '';
	thumbnail.value = '';
});

socket.on('products', (productos) => {
	const productList = productos.map((product) => `
		<tr>
			<td>
				${product.title}
			</td>
			<td>
				$ ${product.price}
			</td>
			<td>
				<img width="50" src=${product.thumbnail} alt="${product.title}">
			</td>
		</tr>
    `).join('');
	const list = document.getElementById('tabla');
	list.innerHTML = productList;
})


//····················CHAT·························
// CUANDO EL USUARIO ESCRIBA UN MENSAJE, EL SERVIDOR LO RECIBE COMO UN CHAT 'chat message' EVENTO
const formChat = document.getElementById('formChat');
const input = document.getElementById('input');
const username = document.getElementById('username');
const message = {
	input,
	username
}

formChat.addEventListener('submit', function (e) {
	e.preventDefault();
	if (input.value) {
		let mensaje = input.value;
		let usuario = username.value;
		socket.emit('chat message', { mensaje, usuario, });
		input.value = '';
	}
});

socket.on('chat historial', function (msg) {
	console.log(msg);
	let messages = document.getElementById('messages');
	msg.map((mensaje) => {
		if (mensaje.usuario != undefined && mensaje.mensaje != undefined) {
			let item = document.createElement('li');
			item.textContent = `${mensaje.usuario}: ${mensaje.mensaje}`;
			messages.appendChild(item);
		}

	})
});

socket.on('chat message', function (msg) {
	let item = document.createElement('li');
	item.textContent = `${msg.usuario}: ${msg.mensaje}`;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});