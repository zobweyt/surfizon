import { createPopper } from '@popperjs/core';
import { popperOptions } from '../utils';

export class Dropdown {
    protected element: HTMLElement;
    protected control!: HTMLElement;
    protected menu!: HTMLElement;

    public get isOpen(): boolean {
        return this.menu.classList.contains('show');
    }

    constructor(target: HTMLElement) {
        this.element = target;

        this.render();
        this.setup();
    }

    protected render(): void {
        this.control = this.element.querySelector('.dropdown-toggle')!;
        this.menu = this.element.querySelector('.dropdown-menu')!;

        createPopper(this.control, this.menu, popperOptions);
    }

    protected setup(): void {
        this.control.addEventListener('click', this.toggle.bind(this));
        document.addEventListener('click', this.documentClicked.bind(this));
    }

    public toggle(): void {
        this.isOpen ? this.hide() : this.show();
    }

    public show(): void {
        this.menu.classList.add('show');
    }

    public hide(): void {
        this.menu.classList.remove('show');
    }

    private documentClicked(event: MouseEvent): void {
        const target = event?.target as HTMLElement;

        if (!this.menu.contains(target) && this.control != target) {
            this.hide();
        }
    }
}