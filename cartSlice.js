import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  coupon: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1,
      });
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (!item) return;

      if (item.quantity === 1) {
        state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
        return;
      }

      item.quantity -= 1;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = '';
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.trim().toUpperCase();
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart, applyCoupon } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartCoupon = (state) => state.cart.coupon;

export default cartSlice.reducer;