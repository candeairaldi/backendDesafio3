//conectar al servidor de Socket.io
const socket = io();

socket.on ("products", products => {
    console.log(products)
    const productsContainter = document.getElementById("table")
    productsContainter.innerHTML = `
    <tr>
        <th>Id:</th>
        <th>Título:</th>
        <th>Descripción:</th>
        <th>Código:</th>
        <th>Precio:</th>
        <th>Stock:</th>
        <th>Imágenes:</th>
    </tr>
    `
    products.forEach((product) => {
        productsContainter.innerHTML += `
        <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.thumbnail}</td>
        </tr>
        `
    }) 
})

// Escuchar al evento 'response' del servidor
socket.on('response', (response) => {
    if(response.status === 'success') {
        document.getElementById('responseContainer').innerHTML = `<p class="success">${response.message}</p>`;
    } else {
        document.getElementById('responseContainer').innerHTML = `<p class="error">${response.message}</p>`;
    }
});    

// Capturar el envío del form de nuevo prod y emitir un evento al servidor
document.getElementById("addNewProduct").addEventListener("submit", (event) => {
    event.preventDefault()

    socket.emit("newProduct", {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        thumbnail: document.getElementById('thumbnail').value
    })
    // Limpiar el formulario después de enviar los datos
    event.target.reset();
});

// Capturar el envío del form de nuevo prod y emitir un evento al servidor
document.getElementById("deleteProduct").addEventListener("submit", (event) => {
    event.preventDefault()
    const pId = document.querySelector("#id").value
    console.log(pId)
    socket.emit("deleteProduct" ,pId )

    // Limpiar el formulario después de enviar los datos
    event.target.reset();

})

