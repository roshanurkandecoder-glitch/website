import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice.js';
import productReducer from '../features/products/productSlice.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
  },
});