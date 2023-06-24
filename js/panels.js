export class PanelGrid {
  constructor(parentRect, preset, lineWidth, lineColor, gutterSize) {
    this.parentRect = parentRect;
    this.preset = preset;
    this.ppi = parentRect.getPpi();
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.gutterSize = gutterSize;
  }

  draw(ctx) {
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.lineColor;
    ctx.setLineDash([0, 0]);
    if (this.lineWidth > 0) {
      switch (this.preset) {
        case "0":
          this.drawGrid(ctx, 1, 1);
          break;
        case "1":
          this.drawGrid(ctx, 2, 2);
          break;
        case "2":
          this.drawGrid(ctx, 3, 3);
          break;
        case "3":
          this.drawGrid(ctx, 4, 4);
          break;
      }
    }
  }

  drawRectangle(ctx, x, y, width, height) {
    ctx.lineWidth = this.lineWidth * this.ppi;
    ctx.strokeStyle = this.lineColor;
    ctx.setLineDash([0, 0]);
    ctx.strokeRect(
      x * this.ppi,
      y * this.ppi,
      width * this.ppi,
      height * this.ppi
    );
  }

  drawGrid(ctx, numRows, numCols) {
    const parentSize = this.parentRect.getSize();
    let panelWidth =
      (parentSize.width - this.gutterSize * (numCols - 1)) / numCols;
    let panelHeight =
      (parentSize.height - this.gutterSize * (numRows - 1)) / numRows;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        let panelX = parentSize.x + panelWidth * col + this.gutterSize * col;
        let panelY = parentSize.y + panelHeight * row + this.gutterSize * row;
        this.drawRectangle(ctx, panelX, panelY, panelWidth, panelHeight);
      }
    }
  }
}
