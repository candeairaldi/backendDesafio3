const fs = require('fs').promises;
const path = require('path');
const { io } = require('./app'); // Importar el objeto 'io' de app.js

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
      this.carts = JSON.parse(cartsData || '[]');
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

  addProduct(product) {
    // Validar campos obligatorios antes de agregar el producto
    if (!product.title || !product.description || !product.code || !product.price || !product.stock) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Autogenerar ID y agregar el producto
    product.id = Date.now().toString(); // Cambiar esta lógica según tus necesidades
    this.products.push(product);

    // Persistir la información en el archivo
    this.saveProductsToFile();

    // Emitir evento de nuevo producto a través de socket.io
    io.emit('newProduct', product);

    return product;
  }

  updateProduct(updatedProduct) {
    // Validar que el producto exista antes de intentar actualizarlo
    const existingProduct = this.getProductById(updatedProduct.id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Actualizar el producto sin cambiar su ID
    Object.assign(existingProduct, updatedProduct);

    // Persistir la información en el archivo
    this.saveProductsToFile();

    return existingProduct;
  }

  deleteProduct(productId) {
    const productIndex = this.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];

    // Persistir la información en el archivo
    this.saveProductsToFile();

    // Emitir evento de eliminación de producto a través de socket.io
    io.emit('deleteProduct', deletedProduct.id);

    return deletedProduct;
  }

  saveProductsToFile() {
    // Persistir la información de productos en el archivo
    fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2))
      .catch(error => console.error('Error writing products file:', error));
  }

  getAllCarts() {
    return this.carts;
  }
}

module.exports = ProductManager;