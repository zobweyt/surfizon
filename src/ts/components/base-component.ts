export abstract class BaseComponent {
  protected readonly element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;

    this.render();
    this.initialize();
  }

  protected abstract render(): void;
  protected abstract initialize(): void;
}
