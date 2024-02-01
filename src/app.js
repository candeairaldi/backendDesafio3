const express = require('express');
const exphbs = require('express-handlebars').create();
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const viewsRouter = require('./routes/views.router');
const realtimeProductsViewRouter = require('./routes/realtimeProductsView.router');

const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');

const app = express();
const port = 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));


// Crear servidor HTTP
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Rutas de las vistas y sockets
app.use('/', viewsRouter);
app.use('/realtimeproducts', realtimeProductsViewRouter);

// Configuración de Socket.io
const io = require('socket.io')(server);
app.set('socketio', io); // Guardar io en el objeto de la aplicación

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });

  // Manejar eventos de productos en tiempo real
  socket.on('newProduct', (product) => {
    // Lógica para manejar la creación de nuevos productos
    io.emit('newProduct', product); // Emitir el evento a todos los clientes
  });

  socket.on('deleteProduct', (productId) => {
    // Lógica para manejar la eliminación de productos
    io.emit('deleteProduct', productId); // Emitir el evento a todos los clientes
  });
});

// Iniciar servidor HTTP
server.listen(port, () => {
  console.log(`El servidor está escuchando en ${port}`);
});
