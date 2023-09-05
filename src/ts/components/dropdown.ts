import {
  VariationPlacement,
  Options as PopperOptions,
  Instance as PopperInstance,
  createPopper,
} from "@popperjs/core";

import { TABINDEX_FIXED, TABINDEX_FOCUSABLE } from "../utils";
import { Component } from "./component";

const CLASS_NAME_SHOW = "show";

const SELECTOR_TOGGLER = `.dropdown__toggle`;
const SELECTOR_MENU = ".dropdown__menu";
const SELECTOR_MENU_ACTION = ".dropdown__menu__action";

// TODO: Override destroy function.

export class Dropdown extends Component {
  protected toggler!: HTMLElement;
  protected menu!: HTMLElement;
  protected popperInstance!: PopperInstance;

  protected override render(): void {
    this.toggler = this.element.querySelector(SELECTOR_TOGGLER)!;
    this.menu = this.element.querySelector(SELECTOR_MENU)!;
    this.popperInstance = createPopper(this.toggler, this.menu, this.popperOptions);
  }

  protected override initialize(): void {
    this.toggler.onclick = this.toggle.bind(this); // TODO: Use `addEventListener` and `removeEventListener` in `destroy`.
    this.toggleTabIndex(false);
  }

  public get isShown(): boolean {
    return this.menu.classList.contains(CLASS_NAME_SHOW);
  }

  public get actions(): NodeListOf<HTMLElement> {
    return this.menu.querySelectorAll<HTMLElement>(SELECTOR_MENU_ACTION);
  }

  public show(): void {
    this.toggleMenuVisibility(true);
  }

  public hide(): void {
    this.toggleMenuVisibility(false);
    this.toggler.focus();
  }

  public toggle(): void {
    this.isShown ? this.hide() : this.show();
  }

  private toggleMenuVisibility(show: boolean): void {
    // TODO: Prevent default scroll on anchor clicks.

    this.menu.classList.toggle(CLASS_NAME_SHOW, show);

    const toggleEventListener = show ? document.addEventListener : document.removeEventListener;
    toggleEventListener("click", this.onOutsideDropdownClick);
    toggleEventListener("keydown", this.onKeydown);

    this.toggleTabIndex(show);
  }

  private onOutsideDropdownClick = (event: MouseEvent): void => {
    const node = event.target as Node;
    const isNodeWithinDropdown = this.menu.contains(node) || this.toggler.contains(node);

    if (!isNodeWithinDropdown) {
      this.hide();
    }
  };

  private onKeydown = (event: KeyboardEvent): void => {
    // TODO: Make local function to avoid copy-paste here.
    const actions = Array.from(this.actions);
    const currentIndex = actions.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case "Escape":
        this.hide();
        break;
      case "ArrowDown":
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % actions.length;
        actions[nextIndex].focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        const previousIndex = (currentIndex - 1 + actions.length) % actions.length;
        actions[previousIndex].focus();
        break;
    }
  };

  private toggleTabIndex(focusable: boolean): void {
    this.actions.forEach((el) => (el.tabIndex = focusable ? TABINDEX_FOCUSABLE : TABINDEX_FIXED));
  }

  private get placement(): VariationPlacement {
    const { placement } = this.element.dataset;
    return (placement as VariationPlacement) || "bottom-start";
  }

  private get popperOptions(): PopperOptions {
    return {
      placement: this.placement,
      strategy: "absolute",
      modifiers: [
        {
          name: "origin",
          enabled: true,
          phase: "main",
          fn: ({ state }) =>  {
            const translationMap: Record<string, string> = {
              top: 'bottom',
              bottom: 'top',
              end: 'right',
              start: 'left',
            };
            
            const origin = (state.placement as string).replace(/\b\w+\b/g, match => translationMap[match] || match).replace('-', ' ');
            
            state.elements.popper.style.transformOrigin = origin;
            return state;
          }
        },
        {
          name: "computeStyles",
          options: {
            gpuAcceleration: false
          },
        },
        {
          name: "offset",
          options: {
            offset: [0, 4],
          },
        },
      ],
    };
  }
}
