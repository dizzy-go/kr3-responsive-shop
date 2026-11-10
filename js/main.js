const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-toggle__icon') : null;
const storedTheme = localStorage.getItem('theme');

if (storedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
} else if (storedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

function updateToggleLabel() {
  if (!themeIcon || !themeToggle) return;
  const current = document.documentElement.getAttribute('data-theme');
  const isDark = current === 'dark' || (current !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
}

if (themeToggle) {
  updateToggleLabel();
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark = current === 'dark' || (current !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleLabel();
  });
}

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formElements = Array.from(orderForm.elements);
    formElements.forEach((el) => {
      if (el.willValidate) el.removeAttribute('aria-invalid');
    });
    if (!orderForm.checkValidity()) {
      formElements.forEach((el) => {
        if (el.willValidate && !el.checkValidity()) {
          el.setAttribute('aria-invalid', 'true');
        }
      });
      orderForm.reportValidity();
      return;
    }
    if (successMessage) successMessage.hidden = false;
    orderForm.reset();
  });
}

const filtersForm = document.getElementById('filters-form');
const productCards = document.querySelectorAll('.catalog-products .product-card');

if (filtersForm) {
  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const priceFrom = parseInt(document.getElementById('price-from').value) || 0;
    const priceTo = parseInt(document.getElementById('price-to').value) || Infinity;

    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardPrice = parseInt(card.getAttribute('data-price'));

      const matchCategory = checkedCategories.length === 0 || checkedCategories.includes(cardCategory);
      const matchPrice = cardPrice >= priceFrom && cardPrice <= priceTo;

      if (matchCategory && matchPrice) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}