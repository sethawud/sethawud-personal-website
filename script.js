function initializeSiteChrome(documentRef = typeof document !== 'undefined' ? document : null, getNow = () => new Date()) {
  if (!documentRef) {
    return;
  }

  const yearElement = documentRef.getElementById?.('current-year');
  const navToggleButton = documentRef.querySelector?.('.site-nav__toggle');
  const navMenu = documentRef.getElementById?.('site-menu');

  if (yearElement) {
    yearElement.textContent = getNow().getFullYear();
  }

  if (navToggleButton && navMenu) {
    navToggleButton.addEventListener('click', () => {
      const isExpanded = navToggleButton.getAttribute('aria-expanded') === 'true';
      navToggleButton.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('is-open', !isExpanded);
    });

    navMenu.querySelectorAll?.('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggleButton.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }
}

initializeSiteChrome();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeSiteChrome };
}
