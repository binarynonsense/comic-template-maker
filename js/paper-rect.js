import { Rect } from "./rect.js";

export class PaperRect extends Rect {
  constructor(
    parent,
    width,
    height,
    ppi,
    lineWidth,
    lineThicknessMultiplier,
    drawHeader,
    headerPadding,
    headerTextHeight
  ) {
    super(parent, width, height, ppi);
    this.lineThicknessMultiplier = lineThicknessMultiplier;
    this.lineWidth = lineWidth * lineThicknessMultiplier;
    this.drawHeader = drawHeader;
    this.headerPadding = headerPadding;
    this.headerTextHeight = headerTextHeight;
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
      ctx.font = `${this.lineThicknessMultiplier > 1 ? "bold " : ""}${
        fontSize * this.ppi
      }px Arial`;
      // BOOK /////////
      let bookTextX = bleedSize.x;
      let bookTextY = bleedSize.y - this.headerPadding;
      ctx.fillText("BOOK: ", bookTextX * this.ppi, bookTextY * this.ppi);
      let bookTextWidthPx = ctx.measureText("BOOK: ");
      let bookLineX = bookTextX + bookTextWidthPx.width / this.ppi;
      let bookLinelength = this.headerTextHeight * 8;
      this.drawLine(
        ctx,
        bookLineX,
        bookTextY,
        0,
        -bookLinelength,
        this.lineWidth,
        [0, 0],
        this.lineColor
      );
      // ISSUE /////////
      let issueTextX = bookLineX + bookLinelength;
      ctx.fillText("  ISSUE #: ", issueTextX * this.ppi, bookTextY * this.ppi);
      let issueTextWidthPx = ctx.measureText("  ISSUE #: ");
      let issueLineX = issueTextX + issueTextWidthPx.width / this.ppi;
      let issueLineLeght = bookLinelength / 4;
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
      let pageLinelength = bookLinelength / 4;
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
