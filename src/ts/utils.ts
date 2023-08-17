import { Options as PopperOptions } from "@popperjs/core";

export const POPPER_OPTIONS: PopperOptions = {
  placement: "bottom-start",
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

export const TABINDEX_FIXED = -1;
export const TABINDEX_FOCUSABLE = 0;

export const wrap = (element: HTMLElement, cls: string) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add(cls);
  element.parentNode!.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  return wrapper;
};
