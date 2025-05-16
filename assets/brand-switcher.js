/**
 * Brand Switcher
 *
 * Handles switching between different brand experiences including:
 * - Storing the selected brand in localStorage
 * - Applying the appropriate brand logo
 * - Switching to the brand-specific menu
 * - Applying brand-specific color schemes
 */

class BrandSwitcher {
  constructor() {
    this.selectedBrand = localStorage.getItem('selectedBrand');
    this.brandElements = document.querySelectorAll('[data-brand-id]');
    this.init();
  }

  init() {
    // Set up event listeners for brand selection
    this.brandElements.forEach((element) => {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        const brandId = element.getAttribute('data-brand-id');
        this.selectBrand(brandId);
      });
    });

    // Apply the selected brand on page load
    if (this.selectedBrand) {
      this.applyBrandSettings(this.selectedBrand);
    }
  }

  selectBrand(brandId) {
    // Store the selected brand
    localStorage.setItem('selectedBrand', brandId);

    // Apply the brand settings
    this.applyBrandSettings(brandId);
  }

  applyBrandSettings(brandId) {
    // Set data attribute on document for CSS targeting
    document.documentElement.setAttribute('data-selected-brand', brandId);

    // Find the selected brand element
    const brandElement = document.querySelector(`[data-brand-id="${brandId}"]`);

    if (!brandElement) return;

    // Update active state
    this.brandElements.forEach((el) => {
      el.classList.remove('brand-selector__item--active');
    });
    brandElement.classList.add('brand-selector__item--active');

    // Apply brand logo
    this.updateBrandLogo(brandElement.getAttribute('data-brand-logo'));

    // Apply brand menu
    this.updateBrandMenu(brandElement.getAttribute('data-brand-menu'));

    // Apply brand color scheme
    this.updateColorScheme(brandElement.getAttribute('data-brand-color-scheme'));

    // Dispatch an event that other components can listen for
    document.dispatchEvent(
      new CustomEvent('brand:changed', {
        detail: { brandId: brandId },
      })
    );
  }

  updateBrandLogo(logoUrl) {
    if (!logoUrl) return;

    const logoElements = document.querySelectorAll('.header__heading-logo');
    logoElements.forEach((logo) => {
      logo.setAttribute('src', logoUrl);
    });
  }

  updateBrandMenu(menuHandle) {
    if (!menuHandle) return;

    // This requires server-side handling in the header.liquid file
    // We'll use a URL parameter to pass the selected menu to the server
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('brand_menu', menuHandle);

    // We don't want to reload the page immediately if we're just initializing
    if (document.readyState === 'complete' && this.initialLoad !== true) {
      window.location.href = currentUrl.toString();
    }

    this.initialLoad = false;
  }

  updateColorScheme(colorScheme) {
    if (!colorScheme) return;

    // Apply CSS variables based on the color scheme
    // This will be enhanced in the theme.liquid file
    document.documentElement.style.setProperty('--selected-brand-scheme', colorScheme);

    // Add a class to the body for additional styling
    document.body.classList.remove(...Array.from(document.body.classList).filter((cls) => cls.startsWith('brand-')));
    document.body.classList.add(`brand-${this.selectedBrand}`);
  }
}

// Initialize the brand switcher when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.brandSwitcher = new BrandSwitcher();
});
