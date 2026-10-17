const test = require('node:test');
const assert = require('node:assert/strict');
const { initializeSiteChrome } = require('../script.js');

class FakeElement {
  constructor() {
    this.textContent = '';
    this.attributes = {};
    this.listeners = {};
    this.links = [];
    this.classSet = new Set();
    this.classList = {
      toggle: (className, force) => {
        if (force) {
          this.classSet.add(className);
          return true;
        }

        this.classSet.delete(className);
        return false;
      },
      remove: (className) => {
        this.classSet.delete(className);
      },
      contains: (className) => this.classSet.has(className),
    };
  }

  addEventListener(eventName, callback) {
    this.listeners[eventName] = callback;
  }

  click() {
    this.listeners.click?.();
  }

  getAttribute(attributeName) {
    return this.attributes[attributeName];
  }

  setAttribute(attributeName, value) {
    this.attributes[attributeName] = value;
  }

  querySelectorAll(selector) {
    if (selector === 'a') {
      return this.links;
    }

    return [];
  }
}

function createFakeDocument({ withYear = true, withNav = true } = {}) {
  const yearElement = withYear ? new FakeElement() : null;
  const navToggleButton = withNav ? new FakeElement() : null;
  const navMenu = withNav ? new FakeElement() : null;
  const linkElement = withNav ? new FakeElement() : null;

  if (navToggleButton) {
    navToggleButton.setAttribute('aria-expanded', 'false');
  }

  if (navMenu && linkElement) {
    navMenu.links = [linkElement];
  }

  const documentRef = {
    getElementById: (id) => {
      if (id === 'current-year') return yearElement;
      if (id === 'site-menu') return navMenu;
      return null;
    },
    querySelector: (selector) => {
      if (selector === '.site-nav__toggle') return navToggleButton;
      return null;
    },
  };

  return { documentRef, yearElement, navToggleButton, navMenu, linkElement };
}

test('sets footer year from provided date source', () => {
  const { documentRef, yearElement } = createFakeDocument();

  initializeSiteChrome(documentRef, () => new Date('2030-01-01T00:00:00Z'));

  assert.equal(yearElement.textContent, 2030);
});

test('does not throw when expected DOM elements are missing', () => {
  assert.doesNotThrow(() => initializeSiteChrome({ getElementById: () => null, querySelector: () => null }));
});

test('toggles menu open state when nav button is clicked', () => {
  const { documentRef, navToggleButton, navMenu } = createFakeDocument();

  initializeSiteChrome(documentRef);

  navToggleButton.click();
  assert.equal(navToggleButton.getAttribute('aria-expanded'), 'true');
  assert.equal(navMenu.classList.contains('is-open'), true);

  navToggleButton.click();
  assert.equal(navToggleButton.getAttribute('aria-expanded'), 'false');
  assert.equal(navMenu.classList.contains('is-open'), false);
});

test('closes mobile menu when a nav link is clicked', () => {
  const { documentRef, navToggleButton, navMenu, linkElement } = createFakeDocument();

  initializeSiteChrome(documentRef);
  navToggleButton.click();
  assert.equal(navMenu.classList.contains('is-open'), true);

  linkElement.click();
  assert.equal(navToggleButton.getAttribute('aria-expanded'), 'false');
  assert.equal(navMenu.classList.contains('is-open'), false);
});
