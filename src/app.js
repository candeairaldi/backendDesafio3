const express = require('express');
const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');

const app = express();
const port = 8080;

app.use(express.json());

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static(`${__dirname}/public`));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});