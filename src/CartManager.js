import fs from "fs"
import { productManager } from './app.js';

export class CartManager {
    constructor () {
    this.path = "./src/data/carts.json";
    };

    getCarts(){
        try {
            const data = fs.readFileSync(this.path, "utf8");
            this.carts = JSON.parse(data);
            return this.carts;      
        } catch (error) {
            console.error("error al leer el archivo", error);
            return []; 
        }
    };


    addCart() { 
        this.getCarts()
        const newCart = {
            id: this.carts.length + 1,
            products: []
        };

        this.carts.push(newCart);

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts));
            console.log("carrito guardado exitosamente");
            return newCart;
                
        } catch (error) {
            console.error("no se guardo el carrito", error)     
        }
    };

    getCartById(cartId){
        this.getCarts()
        const cart = this.carts.find (cart => cart.id === cartId);
        console.log(cart);
        if (cart) {
            return cart;
        } else {
            console.log("Carrito no encontrado");
            return null;
        }    
    };

    addProduct(cartId, productId) {
        try {
            this.getCarts();
            const cart = this.carts.find(cart => cart.id === cartId);

            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cartId}`);
            }

            const existingProduct = cart.products.find(product => product.id === parseInt(productId));

            if (!existingProduct) {
                const product = productManager.getProductById(productId);

                if (!product) {
                    throw new Error(`No se encontró el producto con id ${productId}`);
                }

                cart.products.push({
                    id: parseInt(productId),
                    quantity: 1
                });
            } else {
                existingProduct.quantity++;
            }

            fs.writeFileSync(this.path, JSON.stringify(this.carts));
            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            throw error;
        }
    }


    deleteProduct(cartId, productId) {

        try {
            this.getCarts();
            const cart = this.carts.find(cart => cart.id === cartId);

            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cartId}`);
            }

            const productIndex = cart.products.findIndex(product => product.id === parseInt(productId));

            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${productId} en el carrito con id ${cartId}`);
            }

            const product = cart.products[productIndex];

            if (product.quantity > 1) {
                product.quantity--;
            } else {
                cart.products.splice(productIndex, 1);
            }

            fs.writeFileSync(this.path, JSON.stringify(this.carts));
            return cart;
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
            throw error;
        }
    }
}