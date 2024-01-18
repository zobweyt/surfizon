import {
  Options,
  Instance,
  VariationPlacement,
  createPopper,
} from "@popperjs/core";
import { BaseComponent } from "./base-component";

const CLASS_NAME_SHOW = "show";

const SELECTOR_CONTROL = ".dropdown__toggle";
const SELECTOR_MENU = ".dropdown__menu";

export class Dropdown extends BaseComponent {
  protected control!: HTMLElement;
  protected menu!: HTMLElement;
  protected popper!: Instance;

  public get isOpen(): boolean {
    return this.menu.classList.contains(CLASS_NAME_SHOW);
  }

  protected render(): void {
    this.control = this.element.querySelector(SELECTOR_CONTROL)!;
    this.menu = this.element.querySelector(SELECTOR_MENU)!;
    this.popper = createPopper(this.control, this.menu, this.popperOptions);
  }

  protected initialize(): void {
    this.control.onclick = this.toggle.bind(this);
  }

  public show(): void {
    this.menu.classList.add(CLASS_NAME_SHOW);
    this.popper.update();

    document.addEventListener("click", this.close.bind(this));
  }

  public hide(): void {
    this.menu.classList.remove(CLASS_NAME_SHOW);
    this.popper.update();

    document.removeEventListener("click", this.close.bind(this));
  }

  public toggle(event: MouseEvent): void {
    this.isOpen ? this.hide() : this.show();
  }

  private close(event: MouseEvent): void {
    const clickedNode = event.target as Node;
    const isNodeInMenu = this.menu.contains(clickedNode);
    const isNodeInControl = this.control.contains(clickedNode);
    const clickedOutsideDropdown = !isNodeInMenu && !isNodeInControl;

    if (clickedOutsideDropdown) {
      this.hide();
    }
  }

  private get popperOptions(): Options {
    const placement = this.element.dataset?.placement as VariationPlacement;

    const popperOptions: Options = {
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
            offset: [0, 5],
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

    return popperOptions;
  }
}
