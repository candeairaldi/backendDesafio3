const express = require('express');
const ProductManager = require('../productManager');
const cartRouter = express.Router();
const productManager = new ProductManager();

cartRouter.post('/', (req, res) => {
  const newCart = req.body;
  // Autogenerar ID y agregar el carrito
  newCart.id = Date.now().toString(); // Cambiar esta lógica según tus necesidades
  productManager.addCart(newCart);

  res.json(newCart);
});

cartRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = productManager.getCartById(cartId);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  // Validar que el carrito y el producto existan
  const cart = productManager.getCartById(cartId);
  const product = productManager.getProductById(productId);

  if (!cart || !product) {
    return res.status(404).json({ error: 'Cart or product not found' });
  }

  // Agregar el producto al carrito
  productManager.addProductToCart(cartId, productId, quantity);

  res.json({ message: 'Product added to cart successfully' });
});

module.exports = cartRouter;