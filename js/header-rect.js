/**
 * @license
 * Copyright 2023 Álvaro García
 * www.binarynonsense.com
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
    drawCropMarks,
    cropMarksLineWidth,
    drawHeader,
    headerLineWidth,
    headerPaddingBottom,
    headerPaddingLeft,
    headerTextHeight,
    headerTextWeight
  ) {
    super(parent, x, y, width, height, ppi);
    this.drawCropMarks = drawCropMarks;
    this.cropMarksLineWidth = cropMarksLineWidth;
    this.drawHeader = drawHeader;
    this.headerLineWidth = headerLineWidth;
    this.headerPaddingBottom = headerPaddingBottom;
    this.headerPaddingLeft = headerPaddingLeft;
    this.headerTextHeight = headerTextHeight;
    this.headerTextWeight = headerTextWeight;
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
      const titleTextX =
        (this.drawCropMarks ? trimSize.x : bleedSize.x) +
        this.headerPaddingLeft;
      const titleTextY = bleedSize.y - this.headerPaddingBottom;
      ctx.fillText("TITLE: ", titleTextX * this.ppi, titleTextY * this.ppi);
      const titleTextWidthPx = ctx.measureText("TITLE: ");
      const titleTextWidth = titleTextWidthPx.width / this.ppi;
      const titleLineX = titleTextX + titleTextWidth;
      const titleLineLength = titleTextWidth * 4;
      this.drawLine(
        ctx,
        titleLineX,
        titleTextY,
        0,
        -titleLineLength,
        this.headerLineWidth,
        [0, 0],
        this.lineColor
      );
      // ISSUE /////////
      const issueTextX = titleLineX + titleLineLength;
      ctx.fillText("  ISSUE #: ", issueTextX * this.ppi, titleTextY * this.ppi);
      const issueTextWidthPx = ctx.measureText("  ISSUE #: ");
      const issueLineX = issueTextX + issueTextWidthPx.width / this.ppi;
      const issueLineLenght = titleTextWidth / 1;
      this.drawLine(
        ctx,
        issueLineX,
        titleTextY,
        0,
        -issueLineLenght,
        this.headerLineWidth,
        [0, 0],
        this.lineColor
      );
      // PAGE /////////
      const pageTextX = issueLineX + issueLineLenght;
      ctx.fillText("  PAGE #: ", pageTextX * this.ppi, titleTextY * this.ppi);
      const pageTextWidthPx = ctx.measureText("  PAGE #: ");
      const pageLineX = pageTextX + pageTextWidthPx.width / this.ppi;
      const pageLineLength = titleTextWidth / 1;
      this.drawLine(
        ctx,
        pageLineX,
        titleTextY,
        0,
        -pageLineLength,
        this.headerLineWidth,
        [0, 0],
        this.lineColor
      );
    }
    /////////////////
    // CROP MARKS ///
    /////////////////
    if (this.drawCropMarks) {
      // up left
      this.drawLine(
        ctx,
        trimSize.x,
        bleedSize.y,
        bleedSize.y,
        0,
        this.cropMarksLineWidth,
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
        this.cropMarksLineWidth,
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
        this.cropMarksLineWidth,
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
        this.cropMarksLineWidth,
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
        this.cropMarksLineWidth,
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
        this.cropMarksLineWidth,
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
        this.cropMarksLineWidth,
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
        this.cropMarksLineWidth,
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
