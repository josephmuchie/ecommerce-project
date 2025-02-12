import { products } from './products.js';

export class Cart {
  constructor() {
    if (Cart.instance) {
      return Cart.instance;
    }
    Cart.instance = this;
    this.items = this.loadCart();
    this.updateCartUI();
  }

  loadCart() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateCartUI();
  }

  updateCartUI() {
    // Update cart count
    const cartQuantity = document.querySelector('.js-cart-quantity');
    if (cartQuantity) {
      const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
      cartQuantity.textContent = totalItems;
      cartQuantity.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // Update cart items display
    const cartItemsContainer = document.querySelector('.js-cart-items-container');
    if (cartItemsContainer) {
      let cartItemsHTML = '';
      let subtotal = 0;

      this.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const itemTotal = (product.priceCents * item.quantity);
          subtotal += itemTotal;

          cartItemsHTML += `
            <div class="cart-item-container" data-product-id="${product.id}">
              <div class="cart-item-details-grid">
                <img class="product-image" src="${product.image}">
                <div class="cart-item-details">
                  <div class="product-name">${product.name}</div>
                  <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
                  <div class="product-quantity">
                    <button class="quantity-btn minus" data-product-id="${product.id}">-</button>
                    <span class="quantity-label">${item.quantity}</span>
                    <button class="quantity-btn plus" data-product-id="${product.id}">+</button>
                  </div>
                  <div class="item-total">
                    Item Total: $${(itemTotal / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>`;
        }
      });

      cartItemsContainer.innerHTML = cartItemsHTML || '<div class="empty-cart">Your cart is empty</div>';

      // Update totals if on checkout page
      const shipping = subtotal > 0 ? 499 : 0;
      const tax = Math.round(subtotal * 0.1);
      const total = subtotal + shipping + tax;

      document.querySelectorAll('.js-items-total').forEach(el => 
        el.textContent = `$${(subtotal / 100).toFixed(2)}`);
      document.querySelectorAll('.js-shipping').forEach(el => 
        el.textContent = `$${(shipping / 100).toFixed(2)}`);
      document.querySelectorAll('.js-tax').forEach(el => 
        el.textContent = `$${(tax / 100).toFixed(2)}`);
      document.querySelectorAll('.js-total').forEach(el => 
        el.textContent = `$${(total / 100).toFixed(2)}`);
    }
  }

  addToCart(productId, quantity = 1) {
    const existingItem = this.items.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: productId,
        quantity: quantity
      });
    }

    this.saveCart();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  removeFromCart(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId, change) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  }
}

// Create and export a single cart instance
export const cart = new Cart();

// Set up global event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Handle quantity changes and item removal
  document.addEventListener('click', (e) => {
    const productId = e.target.dataset.productId;
    if (!productId) return;

    if (e.target.classList.contains('plus')) {
      cart.updateQuantity(productId, 1);
    } else if (e.target.classList.contains('minus')) {
      cart.updateQuantity(productId, -1);
    } else if (e.target.classList.contains('remove-item')) {
      cart.removeFromCart(productId);
    }
  });

  // Listen for storage changes from other windows/tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
      cart.items = JSON.parse(e.newValue || '[]');
      cart.updateCartUI();
    }
  });
});