import { Options as PopperOptions } from "@popperjs/core";

export const popperOptions: PopperOptions = {
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

export const wrap = (element: HTMLElement, cls: string) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add(cls);
  element.parentNode!.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  return wrapper;
};
