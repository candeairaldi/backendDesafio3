const fs = require('fs').promises;

class ProductManager {
  constructor() {
    this.products = [];
    this.filePath = './src/products.json';
    this.initialize();
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error reading products file:', error);
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