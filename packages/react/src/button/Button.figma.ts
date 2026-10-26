// url=https://www.figma.com/design/S8owcAVT8gzEJcrJuxuGGL/Pulse-0.2?node-id=57994-2227&t=NKh6XsmphiqRlOYf-4
// source=Button.ts

import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Label text");

const shape = instance.getEnum("Type", {
  Round: "rounded",
  Square: "square",
});

const size = instance.getEnum("Size", {
  XSmall: "extra-small",
  Small: "small",
  Medium: "medium",
  Large: "large",
  XLarge: "extra-large",
});

const state = instance.getString("State");

const disabled =
  state === "Disabled"
    ? figma.code` disabled`
    : figma.code``;

export default {
  example: figma.code`
    <M3eButton
      variant="filled"
      shape="${shape}"
      size="${size}"${disabled}
    >
      ${label}
    </M3eButton>
  `,
  imports: [
    'import { M3eButton } from "@pulse/react/button";',
  ],
  id: "pulse-filled-button",
  metadata: {
    nestable: true,
  },
};