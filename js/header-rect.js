/**
 * @license
 * Copyright 2023 Álvaro García
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Rect } from "./rect.js";

export class HeaderRect extends Rect {
  constructor(
    parent,
    x,
    y,
    width,
    height,
    ppi,
    lineWidth,
    lineWidthMultiplier,
    drawHeader,
    headerPadding,
    headerTextHeight,
    headerTextWeight
  ) {
    super(parent, x, y, width, height, ppi);
    this.lineWidth = lineWidth;
    this.lineWidthMultiplier = lineWidthMultiplier;
    this.drawHeader = drawHeader;
    this.headerPadding = headerPadding;
    this.headerTextHeight = headerTextHeight;
    this.headerTextWeight = headerTextWeight;
  }

  draw(ctx, recursive = false) {
    const bleedSize = this.children[0];
    const fontSize = this.headerTextHeight;
    /////////////////
    // HEADER ///////
    /////////////////
    if (this.drawHeader) {
      ctx.strokeStyle = this.lineColor;
      ctx.fillStyle = this.lineColor;
      ctx.font = `${this.headerTextWeight === "bold" ? "bold " : ""}${
        fontSize * this.ppi
      }px Arial`;
      // TITLE /////////
      let titleTextX = bleedSize.x;
      let titleTextY = bleedSize.y - this.headerPadding;
      ctx.fillText("TITLE: ", titleTextX * this.ppi, titleTextY * this.ppi);
      let titleTextWidthPx = ctx.measureText("TITLE: ");
      let titleLineX = titleTextX + titleTextWidthPx.width / this.ppi;
      let titleLineLength = this.headerTextHeight * 8;
      this.drawLine(
        ctx,
        titleLineX,
        titleTextY,
        0,
        -titleLineLength,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      // ISSUE /////////
      let issueTextX = titleLineX + titleLineLength;
      ctx.fillText("  ISSUE #: ", issueTextX * this.ppi, titleTextY * this.ppi);
      let issueTextWidthPx = ctx.measureText("  ISSUE #: ");
      let issueLineX = issueTextX + issueTextWidthPx.width / this.ppi;
      let issueLineLenght = titleLineLength / 4;
      this.drawLine(
        ctx,
        issueLineX,
        titleTextY,
        0,
        -issueLineLenght,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      // PAGE /////////
      let pageTextX = issueLineX + issueLineLenght;
      ctx.fillText("  PAGE #: ", pageTextX * this.ppi, titleTextY * this.ppi);
      let pageTextWidthPx = ctx.measureText("  PAGE #: ");
      let pageLineX = pageTextX + pageTextWidthPx.width / this.ppi;
      let pageLineLength = titleLineLength / 4;
      this.drawLine(
        ctx,
        pageLineX,
        titleTextY,
        0,
        -pageLineLength,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
    }
    /////////////////
    // BORDER ///////
    /////////////////
    super.draw(ctx, recursive);
  }
}
