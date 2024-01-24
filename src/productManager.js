const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.products = [];
    this.carts = [];
    this.filePath = path.join(__dirname, 'data', 'products.json');
    this.cartsFilePath = path.join(__dirname, 'data', 'carts.json');
    this.initialize();
  }

  async initialize() {
    try {
      const productsData = await fs.readFile(this.filePath, 'utf-8');
      this.products = JSON.parse(productsData);
    } catch (error) {
      console.error('Error reading products file:', error);
    }

    try {
      const cartsData = await fs.readFile(this.cartsFilePath, 'utf-8');
      this.carts = JSON.parse(cartsData);
    } catch (error) {
      console.error('Error reading carts file:', error);
    }
  }

  getProducts(limit) {
    return limit ? this.products.slice(0, limit) : this.products;
  }

  getProductById(productId) {
    return this.products.find(product => product.id === parseInt(productId));
  }
}

module.exports = ProductManager;