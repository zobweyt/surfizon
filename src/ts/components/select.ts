import { Dropdown } from "./dropdown";
import { wrap } from "../utils";

export class Select extends Dropdown {
  protected select!: HTMLSelectElement;

  private get template() {
    const options = this.select.querySelectorAll("option");
    const items = Array.from(options).map(
      (option) => `
        <a href="#" class="dropdown__menu__item dropdown__menu__action" data-value="${option.value}">
          <i class="icon ${option.dataset.icon}"></i>
          <span>${option.textContent}</span>
        </a>`
    );

    return `
      <button type="button" class="btn dropdown__toggle">
        ${this.select.dataset.placeholder}
      </button>
      <div class="dropdown__menu">
        ${items.join("")}
      </div>`;
  }

  private get selectedOption() {
    // TODO: Set this value in `selectOption`. That will speed up operations.
    return this.menu.querySelector<HTMLElement>(".dropdown__menu__action.active");
  }

  constructor(target: HTMLSelectElement) {
    super(wrap(target, "select"));
  }

  protected override render(): void {
    this.select = this.element.querySelector("select")!;
    this.select.style.display = "none";
    this.element.classList.add("dropdown");
    this.element.innerHTML += this.template;

    super.render();
  }

  protected override initialize(): void {
    super.initialize();

    this.menu.querySelectorAll(".dropdown__menu__action").forEach((option) => {
      option.addEventListener("click", this.optionClicked.bind(this));
    });
  }

  public override show(): void {
    super.show();

    this.selectedOption?.focus()
  }

  private selectOption(option: HTMLElement) {
    this.selectedOption?.classList.remove("active");
    this.select.value = option.dataset.value!; // ! That would not change the value at all in event.
    this.toggler.textContent = option.textContent;
    option.classList.add("active");
    (document.activeElement as HTMLElement).blur();

    this.hide();
  }

  private optionClicked(event: Event): void {
    event.preventDefault();

    const option = event.currentTarget as HTMLElement;

    if (!option.classList.contains("active")) {
      this.selectOption(option);

      const form = this.element.closest("form");
      form?.dispatchEvent(new Event("change"));
    }
  }
}
