import { Rect } from "./rect.js";
import { drawGrid as drawPanelGrid } from "./panels.js";

export class SafeRect extends Rect {
  constructor(
    parent,
    x,
    y,
    width,
    height,
    ppi,
    drawBorderMarks,
    borderMarkWidth,
    borderMarkMaxLength,
    middleMarkPos,
    drawPanels
  ) {
    super(parent, x, y, width, height, ppi);
    this.drawBorderMarks = drawBorderMarks;
    this.borderMarkWidth = borderMarkWidth;
    this.borderMarkMaxLength = borderMarkMaxLength;
    this.middleMarkPos = middleMarkPos;
    this.drawPanels = drawPanels;
  }

  // addPanels(panels) {
  //   this.panels = panels;
  // }

  draw(ctx, recursive = false) {
    /////////////////
    // MARKS ////////
    /////////////////
    if (this.drawBorderMarks) {
      /////////////////
      // MIDDLE ///////
      /////////////////
      const bleedSize = this.parent.getParent().getSize();
      let markLineLength = this.borderMarkMaxLength;
      let markLineWidth = this.borderMarkWidth;
      let lineDash = [0, 0];
      // up
      this.drawLine(
        ctx,
        this.x + this.width / 2,
        bleedSize.y,
        markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // down
      this.drawLine(
        ctx,
        this.x + this.width / 2,
        bleedSize.y + bleedSize.height,
        -markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // left
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + this.height / 2,
        0,
        markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // right
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + this.height / 2,
        0,
        -markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      /////////////////
      // THIRDS ///////
      /////////////////
      markLineLength = this.borderMarkMaxLength / 2;
      // up
      this.drawLine(
        ctx,
        this.x + this.width / 3,
        bleedSize.y,
        markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        this.x + (2 * this.width) / 3,
        bleedSize.y,
        markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // down
      this.drawLine(
        ctx,
        this.x + this.width / 3,
        bleedSize.y + bleedSize.height,
        -markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        this.x + (2 * this.width) / 3,
        bleedSize.y + bleedSize.height,
        -markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // left
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + this.height / 3,
        0,
        markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + (2 * this.height) / 3,
        0,
        markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // right
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + this.height / 3,
        0,
        -markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + (2 * this.height) / 3,
        0,
        -markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      /////////////////
      // FOURTHS///////
      /////////////////
      // up
      this.drawLine(
        ctx,
        this.x + this.width / 4,
        bleedSize.y,
        markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        this.x + (3 * this.width) / 4,
        bleedSize.y,
        markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // down
      this.drawLine(
        ctx,
        this.x + this.width / 4,
        bleedSize.y + bleedSize.height,
        -markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        this.x + (3 * this.width) / 4,
        bleedSize.y + bleedSize.height,
        -markLineLength,
        0,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // left
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + this.height / 4,
        0,
        markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + (3 * this.height) / 4,
        0,
        markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      // right
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + this.height / 4,
        0,
        -markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + (3 * this.height) / 4,
        0,
        -markLineLength,
        markLineWidth,
        lineDash,
        this.lineColor
      );
      ///////////////////
      // DOUBLE MIDDLE //
      ///////////////////
      if (this.middleMarkPos && this.middleMarkPos > 0) {
        markLineLength = this.borderMarkMaxLength;
        markLineWidth = this.borderMarkWidth;
        lineDash = [0, 0];
        // up
        this.drawLine(
          ctx,
          this.middleMarkPos,
          bleedSize.y,
          markLineLength,
          0,
          markLineWidth,
          lineDash,
          this.lineColor
        );
        // down
        this.drawLine(
          ctx,
          this.middleMarkPos,
          bleedSize.y + bleedSize.height,
          -markLineLength,
          0,
          markLineWidth,
          lineDash,
          this.lineColor
        );
      }
    }
    /////////////////
    // BORDER ///////
    /////////////////
    super.draw(ctx, recursive);
    /////////////////
    // PANELS ///////
    /////////////////
    if (this.drawPanels) {
      drawPanelGrid(ctx, this.x, this.y, this.width, this.height);
    }
  }
}
