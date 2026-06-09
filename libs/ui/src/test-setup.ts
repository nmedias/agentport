// jsdom lacks a few browser APIs that component libraries (e.g. cmdk, used by
// Command) touch on mount. Polyfill them so specs can render those components.
class ResizeObserverStub {
  observe() {
    /* no-op: jsdom has no layout to observe */
  }
  unobserve() {
    /* no-op */
  }
  disconnect() {
    /* no-op */
  }
}

if (!('ResizeObserver' in globalThis)) {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = ResizeObserverStub;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {
    /* no-op: jsdom does not scroll */
  };
}
