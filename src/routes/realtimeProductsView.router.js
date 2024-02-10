import express from 'express';
import { ProductManager } from '../productManager'


const router = express.Router();
const productManager = new ProductManager();

// Ruta para la vista de productos en tiempo real
router.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('realtimeProducts', { 
      products 
  });
});

export default router