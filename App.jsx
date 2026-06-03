import {
  BadgePercent,
  CreditCard,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  Truck,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  applyCoupon,
  clearCart,
  decreaseQuantity,
  removeFromCart,
  selectCartCount,
  selectCartCoupon,
  selectCartItems,
  selectCartSubtotal,
} from './features/cart/cartSlice.js';
import {
  selectCategories,
  selectProduct,
  selectProducts,
  selectSelectedProduct,
  setCategory,
  setSearchTerm,
  setSortBy,
} from './features/products/productSlice.js';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function calculateTotals(subtotal, coupon) {
  const discount = coupon === 'STYLE15' ? subtotal * 0.15 : 0;
  const shipping = subtotal > 120 || subtotal === 0 ? 0 : 12;
  const tax = (subtotal - discount) * 0.08;

  return {
    discount,
    shipping,
    tax,
    total: Math.max(subtotal - discount + shipping + tax, 0),
  };
}

function App() {
  const cartCount = useSelector(selectCartCount);

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Redux Commerce home">
          <span className="brand-mark">
            <ShoppingBag size={20} />
          </span>
          <span>Redux Commerce</span>
        </Link>

        <nav className="topbar-actions" aria-label="Primary navigation">
          <NavLink className="nav-link" to="/">
            Shop
          </NavLink>
          <button className="icon-button" aria-label="Saved products">
            <Heart size={19} />
          </button>
          <NavLink className="cart-pill" to="/checkout" aria-label={`${cartCount} items in cart`}>
            <ShoppingBag size={18} />
            <span>{cartCount}</span>
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </main>
  );
}

function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const selectedProduct = useSelector(selectSelectedProduct);
  const { searchTerm, category, sortBy } = useSelector((state) => state.products);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Spring edit</span>
          <h1>Everything for the next good day out.</h1>
          <p>
            Shop considered apparel, accessories, footwear, and carry goods with cart state
            powered by Redux Toolkit.
          </p>
          <div className="hero-metrics" aria-label="Store highlights">
            <span>
              <strong>4.8</strong> avg rating
            </span>
            <span>
              <strong>24h</strong> dispatch
            </span>
            <span>
              <strong>15%</strong> coupon
            </span>
          </div>
        </div>

        <div className="featured-product">
          <img src={selectedProduct.image} alt={selectedProduct.name} />
          <div className="featured-info">
            <span>Featured pick</span>
            <strong>{selectedProduct.name}</strong>
            <button onClick={() => dispatch(addToCart(selectedProduct))}>Add to cart</button>
          </div>
        </div>
      </section>

      <section className="commerce-grid">
        <div className="catalog catalog-full">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Catalog</span>
              <h2>Curated products</h2>
            </div>
            <span className="result-count">{products.length} items</span>
          </div>

          <div className="filters" aria-label="Product filters">
            <label className="search-control">
              <Search size={18} />
              <input
                value={searchTerm}
                onChange={(event) => dispatch(setSearchTerm(event.target.value))}
                placeholder="Search products"
              />
            </label>

            <label className="select-control">
              <SlidersHorizontal size={17} />
              <select value={sortBy} onChange={(event) => dispatch(setSortBy(event.target.value))}>
                <option value="featured">Featured</option>
                <option value="priceLow">Price: low to high</option>
                <option value="priceHigh">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>

          <div className="category-tabs" aria-label="Product categories">
            {categories.map((item) => (
              <button
                className={item === category ? 'active' : ''}
                key={item}
                onClick={() => dispatch(setCategory(item))}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article
                className={`product-card ${
                  product.id === selectedProduct.id ? 'selected' : ''
                }`}
                key={product.id}
              >
                <button
                  className="product-image"
                  onClick={() => dispatch(selectProduct(product.id))}
                  aria-label={`View ${product.name}`}
                >
                  <img src={product.image} alt={product.name} />
                </button>
                <div className="product-body">
                  <div>
                    <span className="category-label">{product.category}</span>
                    <h3>{product.name}</h3>
                  </div>
                  <p>{product.description}</p>
                  <div className="product-meta">
                    <span>
                      <Star size={16} fill="currentColor" />
                      {product.rating}
                    </span>
                    <span>{product.stock} in stock</span>
                  </div>
                  <div className="product-footer">
                    <strong>{currency.format(product.price)}</strong>
                    <button onClick={() => dispatch(addToCart(product))}>
                      <Plus size={17} />
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

     
      </section>
    </>
  );
}

function CheckoutPage() {
  const cartItems = useSelector(selectCartItems);

  return (
    <section className="checkout-route">
      <div className="checkout-hero">
        <span className="eyebrow">Checkout</span>
        <h1>Checkout your cart</h1>
        <p>
          Review quantities, apply the `STYLE15` coupon, and confirm your order summary before
          placing the order.
        </p>
      </div>

      <div className="checkout-page-grid">
        <CartPanel variant="page" />
      </div>
    </section>
  );
}

function CartPanel({ variant }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const coupon = useSelector(selectCartCoupon);
  const [couponInput, setCouponInput] = useState(coupon);
  const isCheckoutPage = variant === 'page';
  const totals = useMemo(() => calculateTotals(subtotal, coupon), [coupon, subtotal]);

  const handleCouponSubmit = (event) => {
    event.preventDefault();
    dispatch(applyCoupon(couponInput));
  };

  const handleCheckout = () => {
    if (isCheckoutPage) return;
    navigate('/checkout');
  };

  return (
    <aside
      className={`checkout-panel ${isCheckoutPage ? 'checkout-panel-page' : ''}`}
      aria-label="Cart and checkout"
    >
      <div className="section-heading compact">
        <div>
          <span className="eyebrow">Checkout</span>
          <h2>Your cart</h2>
        </div>
        <ShoppingBag size={22} />
      </div>

      <div className="cart-list">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <PackageCheck size={36} />
            <strong>Your cart is waiting.</strong>
            <span>Add products to build an order summary.</span>
            <Link className="secondary-link" to="/">
              Continue shopping
            </Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <strong>{item.name}</strong>
                <span>{currency.format(item.price)}</span>
                <div className="quantity-controls">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    aria-label={`Decrease ${item.name}`}
                  >
                    <Minus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    aria-label={`Increase ${item.name}`}
                  >
                    <Plus size={15} />
                  </button>
                  <button
                    className="trash-button"
                    onClick={() => dispatch(removeFromCart(item.id))}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form className="coupon-form" onSubmit={handleCouponSubmit}>
        <label>
          <BadgePercent size={17} />
          <input
            value={couponInput}
            onChange={(event) => setCouponInput(event.target.value)}
            placeholder="Try STYLE15"
          />
        </label>
        <button>Apply</button>
      </form>

      <div className="summary">
        <div>
          <span>Subtotal</span>
          <strong>{currency.format(subtotal)}</strong>
        </div>
        <div>
          <span>Discount</span>
          <strong>-{currency.format(totals.discount)}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <strong>{totals.shipping === 0 ? 'Free' : currency.format(totals.shipping)}</strong>
        </div>
        <div>
          <span>Tax</span>
          <strong>{currency.format(totals.tax)}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{currency.format(totals.total)}</strong>
        </div>
      </div>

      <div className="checkout-actions">
        <button
          className="primary-action"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <CreditCard size={18} />
          {isCheckoutPage ? 'Place order' : 'Checkout'}
        </button>
        <button
          className="secondary-action"
          onClick={() => dispatch(clearCart())}
          disabled={cartItems.length === 0}
        >
          Clear cart
        </button>
      </div>

      <div className="shipping-note">
        <Truck size={18} />
        Free shipping unlocks at {currency.format(120)}.
      </div>
    </aside>
  );
}

export default App;