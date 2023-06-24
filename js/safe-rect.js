import { Rect } from "./rect.js";

export class SafeRect extends Rect {
  constructor(
    parent,
    width,
    height,
    ppi,
    lineThicknessMultiplier,
    drawBorderMarks,
    borderMarkMaxLength,
    layoutType
  ) {
    super(parent, width, height, ppi);
    this.lineThicknessMultiplier = lineThicknessMultiplier;
    this.drawBorderMarks = drawBorderMarks;
    this.borderMarkMaxLength = borderMarkMaxLength;
    this.layoutType = layoutType;
    if (this.layoutType !== 0) {
      const parentSize = this.parent.getSize();
      const middleGap = (this.x - parentSize.x) * 2;
      this.width = (this.width - middleGap) / 2;
      if (this.layoutType === 2) {
        // right side
        this.x = this.x + this.width + middleGap;
      } else if (this.layoutType === 1) {
        this.middleMarkPos = this.x + this.width + middleGap / 2;
      }
    }
  }

  addPanels(panels) {
    this.panels = panels;
  }

  draw(ctx, recursive = false) {
    /////////////////
    // MARKS ////////
    /////////////////
    if (this.drawBorderMarks) {
      /////////////////
      // MIDDLE ///////
      /////////////////
      const bleedSize = this.parent.getParent().getSize();
      let lineLength = this.borderMarkMaxLength;
      let lineWidth = 0.01 * this.lineThicknessMultiplier;
      let lineDash = [0, 0];
      // up
      this.drawLine(
        ctx,
        this.x + this.width / 2,
        bleedSize.y,
        lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // down
      this.drawLine(
        ctx,
        this.x + this.width / 2,
        bleedSize.y + bleedSize.height,
        -lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // left
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + this.height / 2,
        0,
        lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // right
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + this.height / 2,
        0,
        -lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      /////////////////
      // THIRDS ///////
      /////////////////
      lineLength = this.borderMarkMaxLength / 2;
      // up
      this.drawLine(
        ctx,
        this.x + this.width / 3,
        bleedSize.y,
        lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        this.x + (2 * this.width) / 3,
        bleedSize.y,
        lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // down
      this.drawLine(
        ctx,
        this.x + this.width / 3,
        bleedSize.y + bleedSize.height,
        -lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        this.x + (2 * this.width) / 3,
        bleedSize.y + bleedSize.height,
        -lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // left
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + this.height / 3,
        0,
        lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + (2 * this.height) / 3,
        0,
        lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // right
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + this.height / 3,
        0,
        -lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + (2 * this.height) / 3,
        0,
        -lineLength,
        lineWidth,
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
        lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        this.x + (3 * this.width) / 4,
        bleedSize.y,
        lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // down
      this.drawLine(
        ctx,
        this.x + this.width / 4,
        bleedSize.y + bleedSize.height,
        -lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        this.x + (3 * this.width) / 4,
        bleedSize.y + bleedSize.height,
        -lineLength,
        0,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // left
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + this.height / 4,
        0,
        lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        bleedSize.x,
        this.y + (3 * this.height) / 4,
        0,
        lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      // right
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + this.height / 4,
        0,
        -lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      this.drawLine(
        ctx,
        bleedSize.x + bleedSize.width,
        this.y + (3 * this.height) / 4,
        0,
        -lineLength,
        lineWidth,
        lineDash,
        this.lineColor
      );
      ///////////////////
      // DOUBLE MIDDLE //
      ///////////////////
      if (this.layoutType === 1) {
        lineLength = this.borderMarkMaxLength;
        lineWidth = 0.01 * this.lineThicknessMultiplier;
        lineDash = [0, 0];
        // up
        this.drawLine(
          ctx,
          this.middleMarkPos,
          bleedSize.y,
          lineLength,
          0,
          lineWidth,
          lineDash,
          this.lineColor
        );
        // down
        this.drawLine(
          ctx,
          this.middleMarkPos,
          bleedSize.y + bleedSize.height,
          -lineLength,
          0,
          lineWidth,
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
    if (this.panels) {
      this.panels.draw(ctx);
    }
  }
}
