const express = require('express');
const ProductManager = require('./productManager');

const app = express();
const port = 8080;
const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = productManager.getProducts(limit);
    res.json(products);
});

app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = productManager.getProductById(productId);
  
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });


app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});