const yearElement = document.getElementById('current-year');
const navToggleButton = document.querySelector('.site-nav__toggle');
const navMenu = document.getElementById('site-menu');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (navToggleButton && navMenu) {
  navToggleButton.addEventListener('click', () => {
    const isExpanded = navToggleButton.getAttribute('aria-expanded') === 'true';
    navToggleButton.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('is-open', !isExpanded);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggleButton.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });
  });
}
