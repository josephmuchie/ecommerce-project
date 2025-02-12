/* filepath: /Users/josephmuchengeti/Documents/Programming/Projects/E-commerce/ecommerce-project/scripts/product-popup.js */
export class ProductPopup {
  constructor(cart) {
    this.cart = cart;
    this.popup = document.querySelector('.js-product-popup');
    this.overlay = document.querySelector('.js-popup-overlay');
    this.closeButton = document.querySelector('.js-popup-close');
    this.detailsContainer = document.querySelector('.js-product-details');
    this.currentImageIndex = 0;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.closeButton.addEventListener('click', () => this.hidePopup());
    this.overlay.addEventListener('click', () => this.hidePopup());
    
    // Close on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.hidePopup();
    });
  }

  showPopup(product) {
    this.currentImageIndex = 0;
    this.detailsContainer.innerHTML = this.generateProductHTML(product);
    this.popup.style.display = 'block';
    this.overlay.style.display = 'block';
    
    const images = product.images || [product.image];
    this.setupImageNavigation(images);
    this.setupQuantityControls();
    this.setupAddToCart(product);
  }

  hidePopup() {
    this.popup.style.display = 'none';
    this.overlay.style.display = 'none';
  }

  generateProductHTML(product) {
    // Ensure product has an images array, fallback to main image if not
    const images = product.images || [product.image];
    
    return `
      <div class="product-media-container">
        <div class="thumbnail-list">
          ${images.map((img, index) => `
            <img src="${img}" 
                class="thumbnail ${index === 0 ? 'active' : ''}" 
                data-index="${index}"
                alt="${product.name} view ${index + 1}">
          `).join('')}
        </div>
        <div class="main-image-container">
          <img src="${images[0]}" class="main-image js-main-image" 
               alt="${product.name}">
          ${images.length > 1 ? `
            <button class="image-nav-button prev js-prev-image">❮</button>
            <button class="image-nav-button next js-next-image">❯</button>
            <div class="image-counter js-image-counter">1/${images.length}</div>
          ` : ''}
        </div>
      </div>
      <div class="product-info">
        <h2 class="product-title">${product.name}</h2>
        <div class="product-rating-container">    
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>
        <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
        <p class="product-description">${product.description || ''}</p>
        <div class="quantity-selector">
          <button class="quantity-button js-quantity-decrease">-</button>
          <input type="number" class="quantity-input js-quantity-input" 
                 value="1" min="1" max="999">
          <button class="quantity-button js-quantity-increase">+</button>
        </div>
        <button class="add-to-cart-button js-add-to-cart">Add to Cart</button>
      </div>
    `;
  }

  setupQuantityControls() {
    const input = this.popup.querySelector('.js-quantity-input');
    const decrease = this.popup.querySelector('.js-quantity-decrease');
    const increase = this.popup.querySelector('.js-quantity-increase');

    decrease.addEventListener('click', () => {
      input.value = Math.max(1, parseInt(input.value) - 1);
    });

    increase.addEventListener('click', () => {
      input.value = Math.min(999, parseInt(input.value) + 1);
    });

    input.addEventListener('change', () => {
      input.value = Math.min(999, Math.max(1, parseInt(input.value) || 1));
    });
  }

  setupThumbnails() {
    const thumbnails = this.popup.querySelectorAll('.thumbnail');
    const mainImage = this.popup.querySelector('.js-main-image');

    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
        mainImage.src = thumbnail.dataset.image;
      });
    });
  }

  setupImageNavigation(images) {
    if (!images || images.length <= 1) return;

    const mainImage = this.popup.querySelector('.js-main-image');
    const thumbnails = this.popup.querySelectorAll('.thumbnail');
    const counter = this.popup.querySelector('.js-image-counter');
    const prevButton = this.popup.querySelector('.js-prev-image');
    const nextButton = this.popup.querySelector('.js-next-image');

    const updateImage = (index) => {
      this.currentImageIndex = index;
      mainImage.src = images[index];
      thumbnails.forEach(thumb => thumb.classList.remove('active'));
      thumbnails[index].classList.add('active');
      counter.textContent = `${index + 1}/${images.length}`;
    };

    prevButton?.addEventListener('click', () => {
      const newIndex = (this.currentImageIndex - 1 + images.length) % images.length;
      updateImage(newIndex);
    });

    nextButton?.addEventListener('click', () => {
      const newIndex = (this.currentImageIndex + 1) % images.length;
      updateImage(newIndex);
    });

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.index);
        updateImage(index);
      });
    });
  }

  setupAddToCart(product) {
    const addToCartButton = this.popup.querySelector('.js-add-to-cart');
    addToCartButton.addEventListener('click', () => {
      const quantity = parseInt(this.popup.querySelector('.js-quantity-input').value);
      this.cart.addToCart(product.id, quantity);
      this.hidePopup();
    });
  }
}