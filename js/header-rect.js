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
      // BOOK /////////
      let bookTextX = bleedSize.x;
      let bookTextY = bleedSize.y - this.headerPadding;
      ctx.fillText("BOOK: ", bookTextX * this.ppi, bookTextY * this.ppi);
      let bookTextWidthPx = ctx.measureText("BOOK: ");
      let bookLineX = bookTextX + bookTextWidthPx.width / this.ppi;
      let bookLineLength = this.headerTextHeight * 8;
      this.drawLine(
        ctx,
        bookLineX,
        bookTextY,
        0,
        -bookLineLength,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      // ISSUE /////////
      let issueTextX = bookLineX + bookLineLength;
      ctx.fillText("  ISSUE #: ", issueTextX * this.ppi, bookTextY * this.ppi);
      let issueTextWidthPx = ctx.measureText("  ISSUE #: ");
      let issueLineX = issueTextX + issueTextWidthPx.width / this.ppi;
      let issueLineLeght = bookLineLength / 4;
      this.drawLine(
        ctx,
        issueLineX,
        bookTextY,
        0,
        -issueLineLeght,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      // PAGE /////////
      let pageTextX = issueLineX + issueLineLeght;
      ctx.fillText("  PAGE #: ", pageTextX * this.ppi, bookTextY * this.ppi);
      let pageTextWidthPx = ctx.measureText("  PAGE #: ");
      let pageLineX = pageTextX + pageTextWidthPx.width / this.ppi;
      let pageLinelength = bookLineLength / 4;
      this.drawLine(
        ctx,
        pageLineX,
        bookTextY,
        0,
        -pageLinelength,
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
