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
    headerTextWeight,
    drawCropMarks
  ) {
    super(parent, x, y, width, height, ppi);
    this.lineWidth = lineWidth;
    this.lineWidthMultiplier = lineWidthMultiplier;
    this.drawHeader = drawHeader;
    this.headerPadding = headerPadding;
    this.headerTextHeight = headerTextHeight;
    this.headerTextWeight = headerTextWeight;
    this.drawCropMarks = drawCropMarks;
  }

  draw(ctx, recursive = false) {
    const bleedSize = this.children[0];
    const trimSize = bleedSize.children[0];
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
      let titleTextX = trimSize.x;
      let titleTextY = bleedSize.y - this.headerPadding;
      ctx.fillText("  TITLE: ", titleTextX * this.ppi, titleTextY * this.ppi);
      let titleTextWidthPx = ctx.measureText("  TITLE: ");
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
    // CROP MARKS ///////
    /////////////////
    // TODO: use custom condition
    if (this.drawCropMarks) {
      // up left
      this.drawLine(
        ctx,
        trimSize.x,
        bleedSize.y,
        bleedSize.y,
        0,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      // up right
      this.drawLine(
        ctx,
        trimSize.x + trimSize.width,
        bleedSize.y,
        bleedSize.y,
        0,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      // down left
      this.drawLine(
        ctx,
        trimSize.x,
        bleedSize.y + bleedSize.height,
        -(this.height - bleedSize.y + bleedSize.height),
        0,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      // down right
      this.drawLine(
        ctx,
        trimSize.x + trimSize.width,
        bleedSize.y + bleedSize.height,
        -(this.height - bleedSize.y + bleedSize.height),
        0,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      //left up
      this.drawLine(
        ctx,
        bleedSize.x,
        trimSize.y,
        0,
        bleedSize.x,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      //left down
      this.drawLine(
        ctx,
        bleedSize.x,
        trimSize.y + trimSize.height,
        0,
        bleedSize.x,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      //right up
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        trimSize.y,
        0,
        -(this.width - bleedSize.x + bleedSize.width),
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      //right down
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        trimSize.y + trimSize.height,
        0,
        -(this.width - bleedSize.x + bleedSize.width),
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
