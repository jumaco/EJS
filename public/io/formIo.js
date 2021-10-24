const socket = io.connect();

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const articulo = document.getElementsById('nombre').value;
  const precio = document.getElementsById('precio').value;
  const imagen = document.getElementsById('foto').value;
  
  socket.emit('new-product', {articulo, precio, imagen});
  articulo.value = '';
  precio.value = '';
  imagen.value = '';
});

socket.on('products', (productos, hayProductos) => {
  console.log(productos);
  console.log(hayProductos);

//   const productList = products.map((product) => `
//     <li>Articulo: ${product.articulo} - Precio: ${product.precio}</li>
//   `).join(' ');

//   const list = document.getElementById('real-time-products');

//   list.innerHTML = `<ul>${productList}</ul>`;
})