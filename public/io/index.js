// VINCULA CONTRA SERVIDOR
const socket = io(); // YA PODEMOS EMPEZAR A USAR LOS SOCKETS DESDE EL CLIENTE :)

// ESCUCHA DEL CLIENTE
socket.on('mi mensaje', data => {
    alert(data)
    socket.emit('notificacion', `Notificacion de ${socket.id}: Mensaje recibido exitosamente!!!`)
})

// CUANDO EL USUARIO ESCRIBA UN MENSAJE, EL SERVIDOR LO RECIBE COMO UN CHAT MESSAGEEVENTO
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
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    var item = document.createElement('li');
    item.textContent = `${socket.id} dice: ${msg}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});