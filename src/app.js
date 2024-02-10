import { fileURLToPath } from "url"; 
import { dirname } from "path"; 
import express from "express";
import path from 'path'
import handlebars from 'express-handlebars'
import { Server } from "socket.io";
import { createServer } from 'http';
import viewsRouter from './routes/views.router.js'
import cartRouter from './routes/carts.router.js'
import productRouter from './routes/products.router.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

global.__dirname = __dirname;

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());  //interpretacion de json al recibir del post
app.use(express.urlencoded({ extended: true }));  //lee lo par
app.use(express.static(path.join(__dirname, '/public')));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Rutas de la API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Rutas de las vistas y sockets
app.use('/', viewsRouter);


//crear servidor HTTP
const httpServer = createServer(app);

// Configuración de Socket.io
const  io = new Server(httpServer);

// Guardar io en el objeto de la aplicación
app.set('socketio', io); 

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

httpServer.listen(port, () => console.log(`server running on port ${port}`));


// Importar ProductManager y crear instancia pasando 'app' como parámetro
import ProductManager from './productManager.js';

const productManager = new ProductManager(app);