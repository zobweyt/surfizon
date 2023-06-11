import {
  VariationPlacement,
  Options as PopperOptions,
  Instance as PopperInstance,
  createPopper,
} from "@popperjs/core";

import { BaseComponent } from "./base-component";

const CLASS_NAME_SHOW = "show";
const CLASS_NAME_OVERLAY = "overlay";

// TODO: move to `../constants.ts`.
const SELECTOR_ENABLED = ":not(.disabled):enabled";

const SELECTOR_CONTROL = `.dropdown__toggle${SELECTOR_ENABLED}`;
const SELECTOR_MENU = ".dropdown__menu";

// TODO: add destroy or desponse function.

export class Dropdown extends BaseComponent {
  protected control!: HTMLElement;
  protected menu!: HTMLElement;
  protected popperInstance!: PopperInstance;

  protected override render(): void {
    this.control = this.element.querySelector(SELECTOR_CONTROL)!;
    this.menu = this.element.querySelector(SELECTOR_MENU)!;
    this.popperInstance = createPopper(this.control, this.menu, this.popperOptions);
  }

  protected override initialize(): void {
    this.control.onclick = this.toggle.bind(this);
  }

  public get isShown(): boolean {
    return this.menu.classList.contains(CLASS_NAME_SHOW);
  }

  public show(): void {
    this.toggleMenuVisibility(true);
  }

  public hide(): void {
    this.toggleMenuVisibility(false);
  }

  public toggle(): void {
    this.isShown ? this.hide() : this.show();
  }

  private toggleMenuVisibility(show: boolean): void {
    this.menu.classList.toggle(CLASS_NAME_SHOW, show);
    document.body.classList.toggle(CLASS_NAME_OVERLAY, show);

    // TODO: rename `func` variable.
    const func = show ? document.addEventListener : document.removeEventListener;
    func("click", this.handleOutsideDropdownInteraction);

    this.popperInstance.update();
  }

  private handleOutsideDropdownInteraction = (event: MouseEvent): void => {
    const node = event.target as Node;
    const isNodeWithinDropdown = this.menu.contains(node) || this.control.contains(node);

    isNodeWithinDropdown || this.hide();
  };

  private get popperOptions(): PopperOptions {
    const placement = this.element.dataset.placement as VariationPlacement;

    return {
      placement: placement ?? "bottom-start",
      strategy: "absolute",
      modifiers: [
        {
          name: "computeStyles",
          options: {
            adaptive: false,
          },
        },
        {
          name: "offset",
          options: {
            offset: [0, 4],
          },
        },
        {
          name: "flip",
          options: {
            allowedAutoPlacements: ["top"],
          },
        },
      ],
    };
  }
}
