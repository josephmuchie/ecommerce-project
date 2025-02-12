/* filepath: /Users/josephmuchengeti/Documents/Programming/Projects/E-commerce/ecommerce-project/scripts/filter-panel.js */
export class FilterPanel {
  constructor() {
    this.minPrice = document.querySelector('.js-min-price');
    this.maxPrice = document.querySelector('.js-max-price');
    this.applyButton = document.querySelector('.js-apply-price');
    this.departmentFilters = document.querySelector('.js-department-filters');
    this.brandFilters = document.querySelector('.js-brand-filters');
    
    this.setupEventListeners();
    this.populateFilters();
  }

  setupEventListeners() {
    this.applyButton.addEventListener('click', () => {
      this.applyPriceFilter();
    });
  }

  populateFilters() {
    // Example department filters
    const departments = [
      'Electronics', 'Computers', 'Smart Home', 
      'Arts & Crafts', 'Beauty', 'Fashion',
      'Books', 'Toys', 'Health', 'Automotive'
    ];

    departments.forEach(dept => {
      this.departmentFilters.innerHTML += `
        <label class="filter-option">
          <input type="checkbox" class="filter-checkbox" value="${dept}">
          <span class="filter-label">${dept}</span>
        </label>
      `;
    });
  }

  applyPriceFilter() {
    const min = this.minPrice.value;
    const max = this.maxPrice.value;
    // Implement price filtering logic here
  }
}