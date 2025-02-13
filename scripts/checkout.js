import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

export function initializeCartHeader() {
  const cartQuantity = document.querySelector('.js-cart-quantity');
  if (cartQuantity) {
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartQuantity.textContent = totalItems;
    cartQuantity.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

function generateCartHTML() {
  let cartItemsHTML = '';
  let itemsCount = 0;
  let itemsTotal = 0;

  // Load fresh cart data
  const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.items = cartData;

  cart.items.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const itemTotal = (product.priceCents * item.quantity);
      itemsTotal += itemTotal;
      itemsCount += item.quantity;

      cartItemsHTML += `
        <div class="cart-item-container" data-product-id="${product.id}">
          <div class="cart-item-details-grid">
            <img class="product-image" src="${product.image}">
            <div class="cart-item-details">
              <div class="product-name">${product.name}</div>
              <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
              <div class="product-quantity">
                <div class="quantity-controls">
                  <button class="quantity-btn js-decrease-quantity" data-product-id="${product.id}">-</button>
                  <span class="quantity-label">${item.quantity}</span>
                  <button class="quantity-btn js-increase-quantity" data-product-id="${product.id}">+</button>
                </div>
                <div class="item-total">Item Total: $${(itemTotal / 100).toFixed(2)}</div>
              </div>
              <div class="item-actions">
                <button class="delete-quantity-link js-delete-item" data-product-id="${product.id}">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>`;
    }
  });

  return { cartItemsHTML, itemsCount, itemsTotal };
}

function updateCheckoutSummary() {
  const { cartItemsHTML, itemsCount, itemsTotal } = generateCartHTML();
  
  // Update cart items container
  const cartContainer = document.querySelector('.js-cart-items-container');
  if (cartContainer) {
    cartContainer.innerHTML = cartItemsHTML || '<div class="empty-cart">Your cart is empty</div>';
  }
  
  // Update cart header
  const cartQuantity = document.querySelector('.js-cart-quantity');
  if (cartQuantity) {
    cartQuantity.textContent = itemsCount;
    cartQuantity.style.display = itemsCount > 0 ? 'block' : 'none';
  }

  // Calculate totals
  const shipping = itemsCount > 0 ? 499 : 0;
  const subtotal = itemsTotal;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  // Update summary elements
  const summaryElements = {
    '.js-items-count': itemsCount,
    '.js-items-total': `$${(subtotal / 100).toFixed(2)}`,
    '.js-shipping': `$${(shipping / 100).toFixed(2)}`,
    '.js-subtotal': `$${(subtotal / 100).toFixed(2)}`,
    '.js-tax': `$${(tax / 100).toFixed(2)}`,
    '.js-total': `$${(total / 100).toFixed(2)}`
  };

  Object.entries(summaryElements).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart.items = JSON.parse(savedCart);
  }
}

function updateCartItemsCount() {
  const cartItemsCount = document.querySelector('.js-cart-items-count');
  if (cartItemsCount) {
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartItemsCount.textContent = `${totalItems} items`;
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  updateCheckoutSummary();
  initializeCartHeader();
  loadCartFromLocalStorage();
  updateCartItemsCount();

  // Handle cart item interactions
  document.querySelector('.js-cart-items-container')?.addEventListener('click', (event) => {
    const target = event.target;
    const productId = target.dataset.productId;

    if (!productId) return;

    if (target.classList.contains('js-delete-item')) {
      cart.removeFromCart(productId);
    } else if (target.classList.contains('js-increase-quantity')) {
      cart.updateQuantity(productId, 1);
    } else if (target.classList.contains('js-decrease-quantity')) {
      cart.updateQuantity(productId, -1);
    }

    updateCheckoutSummary();
    initializeCartHeader();
  });

  // Handle place order button
  document.querySelector('.js-place-order')?.addEventListener('click', () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    alert('Order placed! Thank you for shopping with us.');
    cart.clearCart();
    window.location.href = 'amazon.html';
  });
});

// Listen for cart changes from other pages
window.addEventListener('storage', (e) => {
  if (e.key === 'cart') {
    updateCheckoutSummary();
    initializeCartHeader();
  }
});