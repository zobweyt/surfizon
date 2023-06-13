import {
  VariationPlacement,
  PositioningStrategy,
  Options as PopperOptions,
  Instance as PopperInstance,
  createPopper,
} from "@popperjs/core";

import { BaseComponent } from "./base-component";

const CLASS_NAME_SHOW = "show";
const CLASS_NAME_OVERLAY = "overlay";

// TODO: move to `../constants.ts`.
const SELECTOR_ENABLED = ":not(.disabled):enabled";

const SELECTOR_CONTROL = `.dropdown__toggle`;
const SELECTOR_MENU = ".dropdown__menu";

// TODO: add destroy or desponse function.

export class Dropdown extends BaseComponent {
  protected control!: HTMLElement;
  protected menu!: HTMLElement;
  protected popperInstance!: PopperInstance;
  protected backdrop!: HTMLElement;

  protected override render(): void {
    this.control = this.element.querySelector(SELECTOR_CONTROL)!;
    this.menu = this.element.querySelector(SELECTOR_MENU)!;
    this.popperInstance = createPopper(this.control, this.menu, this.popperOptions);

    // this.backdrop = document.createElement("div");
    // this.backdrop.classList.add("backdrop");
  }

  protected override initialize(): void {
    // ! Maybe use here addEventListener? you have to implement destroying as well.

    this.control.onclick = this.toggle.bind(this);
  }

  public get isShown(): boolean {
    return this.menu.classList.contains(CLASS_NAME_SHOW);
  }

  // TODO: prevent default scroll on links.
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

    // const adjustChild = show ? document.body.appendChild : document.body.removeChild;
    // adjustChild(this.backdrop);
    //show ? document.body.appendChild(this.backdrop) : document.body.removeChild(this.backdrop);

    const adjustEventListener = show ? document.addEventListener : document.removeEventListener;
    adjustEventListener("click", this.handleOutsideDropdownInteraction);
    adjustEventListener("keydown", this.handleKeydownAccessibility);

    this.popperInstance.update();
  }

  private handleOutsideDropdownInteraction = (event: MouseEvent): void => {
    const node = event.target as Node;
    const isNodeWithinDropdown = this.menu.contains(node) || this.control.contains(node);

    isNodeWithinDropdown || this.hide();
  };

  private handleKeydownAccessibility = (event: KeyboardEvent): void => {
    event.key === "Escape" && this.hide();
  };

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
      ],
    };
  }
}
