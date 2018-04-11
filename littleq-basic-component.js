/**
 * # littleq-basic-component
 * `<littleq-basic-component>` Test component
 *
 * @customElement
 *
 */

class TestComponent extends window.HTMLElement {
  static get is () { return 'littleq-basic-component'; }

  testMethod () {
    console.log('test');
  }
}

if (!window.customElements.get(TestComponent.is)) {
  window.customElements.define(TestComponent.is, TestComponent);
} else {
  console.warn(`${TestComponent.is} is already defined somewhere. Please check your code.`);
}
