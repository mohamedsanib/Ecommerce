import {products}  from "../data/products.js";
import { cart } from "../data/cart.js";

import { displayAllProducts, addCartEvent , setCart, getCart, cartPopup} from "./function.js";





displayAllProducts(products);
addCartEvent();
cartPopup();

