import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/** @internal */
export const SearchViewToken = {
  containerColor: unsafeCSS(`var(--m3e-search-view-container-color, ${DesignToken.color.surfaceContainerHigh})`),
  containedContainerColor: unsafeCSS(
    `var(--m3e-search-view-contained-container-color, ${DesignToken.color.surfaceContainerLow})`,
  ),
  dividerColor: unsafeCSS(`var(--m3e-search-view-divider-color, ${DesignToken.color.outline})`),
  dividerThickness: unsafeCSS(`var(--m3e-search-view-divider-thickness, 1px)`),
  fullScreenContainerShape: unsafeCSS(
    `var(--m3e-search-view-full-screen-container-shape, ${DesignToken.shape.corner.none})`,
  ),
  fullScreenHeaderContainerHeight: unsafeCSS("var(--m3e-search-view-full-screen-header-container-height, 4.5rem)"),
  dockedContainerShape: unsafeCSS(
    `var(--m3e-search-view-docked-container-shape, ${DesignToken.shape.corner.extraLarge})`,
  ),
  dockedHeaderContainerHeight: unsafeCSS("var(--m3e-search-view-docked-header-container-height, 3.5rem)"),
  containedLeadingMargin: unsafeCSS(
    `var(--m3e-search-view-contained-leading-margin, ${DesignToken.measurement.space300})`,
  ),
  containedTrailingMargin: unsafeCSS(
    `var(--m3e-search-view-contained-trailing-margin, ${DesignToken.measurement.space300})`,
  ),
  containedFocusedLeadingMargin: unsafeCSS(
    `var(--m3e-search-view-contained-focused-leading-margin, ${DesignToken.measurement.space300})`,
  ),
  containedFocusedTrailingMargin: unsafeCSS(
    `var(--m3e-search-view-contained-focused-trailing-margin, ${DesignToken.measurement.space150})`,
  ),
  containedDockedBarResultsGap: unsafeCSS(
    `var(--m3e-search-view-contained-docked-bar-results-gap, ${DesignToken.measurement.space25})`,
  ),
  containedDockedResultsShape: unsafeCSS(
    `var(--m3e-search-view-contained-docked-results-shape, ${DesignToken.shape.corner.medium})`,
  ),
  containedDockedBarShape: unsafeCSS(
    `var(--m3e-search-view-contained-docked-bar-shape, ${DesignToken.shape.corner.full})`,
  ),
  containedFullScreenBarContainerHeight: unsafeCSS(
    "var(--m3e-search-view-contained-full-screen-bar-container-height, 3.5rem)",
  ),
  dockedContainerMinHeight: unsafeCSS("var(--m3e-search-view-docked-container-min-height, 240px)"),
  dockedContainerMaxHeight: unsafeCSS("var(--m3e-search-view-docked-container-max-height, calc(100vh * 0.6667))"),
  containedDockedResultsSpace: unsafeCSS(
    `var(--m3e-search-view-contained-docked-results-space, ${DesignToken.measurement.space50})`,
  ),
  dockedResultsBottomSpace: unsafeCSS(
    `var(--m3e-search-view-docked-results-bottom-space,  ${DesignToken.measurement.space200})`,
  ),
  dockedScrimColor: unsafeCSS(`var(--m3e-search-view-docked-scrim-color, ${DesignToken.color.scrim})`),
  dockedScrimOpacity: unsafeCSS("var(--m3e-search-view-docked-scrim-opacity, 32%)"),
} as const;
