import { css, CSSResultGroup } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Baseline styles for `M3eCalloutElement`.
 * @internal
 */
export const CalloutStyle: CSSResultGroup = css`
  :host {
    display: block;
  }
  .base {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: clip;
    padding-inline-start: var(--m3e-callout-leading-space, ${DesignToken.measurement.space200});
    padding-inline-end: var(--m3e-callout-trailing-space, ${DesignToken.measurement.space200});
    padding-block-start: calc(
      var(--m3e-callout-top-space, ${DesignToken.measurement.space150}) + ${DesignToken.density.calcHalf(-3)}
    );
    padding-block-end: calc(
      var(--m3e-callout-bottom-space, ${DesignToken.measurement.space150}) + ${DesignToken.density.calcHalf(-3)}
    );
  }
  .base::before {
    content: "";
    position: absolute;
    inset: 0;
    inline-size: var(--m3e-callout-leading-accent-size, 4px);
  }
  .header {
    flex: none;
    display: flex;
    align-items: center;
    column-gap: var(--m3e-callout-icon-label-space, ${DesignToken.measurement.space100});
  }
  slot[name="icon"] {
    font-size: var(--m3e-callout-icon-size, 24px);
    --m3e-icon-size: var(--m3e-callout-icon-size, 24px);
  }
  ::slotted([slot="icon"]) {
    font-size: inherit !important;
    flex: none;
  }
  ::slotted(svg[slot="icon"]) {
    width: 1em;
    height: 1em;
  }
  slot[name="label"] {
    font-size: var(--m3e-callout-label-font-size, ${DesignToken.typescale.standard.title.medium.fontSize});
    font-weight: var(--m3e-callout-label-font-weight, ${DesignToken.typescale.standard.title.medium.fontWeight});
    line-height: var(--m3e-callout-label-line-height, ${DesignToken.typescale.standard.title.medium.lineHeight});
    letter-spacing: var(--m3e-callout-label-tracking, ${DesignToken.typescale.standard.title.medium.tracking});
  }
  .content {
    font-size: var(--m3e-callout-content-font-size, ${DesignToken.typescale.standard.body.large.fontSize});
    font-weight: var(--m3e-callout-content-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight});
    line-height: var(--m3e-callout-content-line-height, ${DesignToken.typescale.standard.body.large.lineHeight});
    letter-spacing: var(--m3e-callout-content-tracking, ${DesignToken.typescale.standard.body.large.tracking});
  }
  :host(:is(:state(--with-icon), :--with-icon)) .base,
  :host(:is(:state(--with-label), :--with-label)) .base {
    row-gap: calc(
      var(--m3e-callout-label-content-space, ${DesignToken.measurement.space100}) + ${DesignToken.density.calc(-3)}
    );
  }
  :host(:is(:state(--rounded), :--rounded)) .base {
    border-radius: var(--m3e-callout-rounded-shape, ${DesignToken.shape.corner.large});
  }
  :host(:is(:state(--square), :--square)) .base {
    border-radius: var(--m3e-callout-square-shape, ${DesignToken.shape.corner.none});
  }
  @media (forced-colors: active) {
    .base {
      background-color: transparent !important;
    }
    .base::before {
      background-color: CanvasText !important;
    }
    slot[name="icon"],
    slot[name="label"],
    .content {
      color: CanvasText !important;
    }
    .base {
      outline: solid 1px CanvasText;
    }
  }
`;
