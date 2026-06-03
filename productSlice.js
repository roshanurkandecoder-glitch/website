import { createSlice } from '@reduxjs/toolkit';
import { products } from '../../data/products.js';

const initialState = {
  items: products,
  searchTerm: '',
  category: 'All',
  sortBy: 'featured',
  selectedProductId: products[0]?.id ?? null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    selectProduct: (state, action) => {
      state.selectedProductId = action.payload;
    },
  },
});

export const { setSearchTerm, setCategory, setSortBy, selectProduct } = productSlice.actions;

export const selectProducts = (state) => {
  const { items, searchTerm, category, sortBy } = state.products;
  const query = searchTerm.toLowerCase().trim();

  return items
    .filter((product) => category === 'All' || product.category === category)
    .filter((product) =>
      [product.name, product.category, product.description].join(' ').toLowerCase().includes(query),
    )
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.featuredScore - a.featuredScore;
    });
};

export const selectCategories = (state) => [
  'All',
  ...new Set(state.products.items.map((product) => product.category)),
];

export const selectSelectedProduct = (state) =>
  state.products.items.find((product) => product.id === state.products.selectedProductId) ??
  state.products.items[0];

export default productSlice.reducer;