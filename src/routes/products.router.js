import express from 'express';
import ProductManager from '../productManager.js';

const productRouter = express.Router();
const productManager = new ProductManager();

productRouter.get('/', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = productManager.getProducts(limit);
  res.json(products);
});

productRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

productRouter.post('/', (req, res) => {
  const newProduct = req.body;
  // Validar campos obligatorios antes de agregar el producto
  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Autogenerar ID y agregar el producto
  newProduct.id = Date.now().toString(); // Cambiar esta lógica según tus necesidades
  productManager.addProduct(newProduct);

  res.json(newProduct);
});

productRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  // Validar que el producto exista antes de intentar actualizarlo
  const existingProduct = productManager.getProductById(productId);
  if (!existingProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Actualizar el producto sin cambiar su ID
  updatedProduct.id = existingProduct.id;
  productManager.updateProduct(updatedProduct);

  res.json(updatedProduct);
});

productRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  productManager.deleteProduct(productId);

  res.json({ message: 'Product deleted successfully' });
});

export default productRouter;