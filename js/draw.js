import { Rect } from "./rect.js";
import { SafeRect } from "./safe-rect.js";
import { HeaderRect as HeaderRect } from "./header-rect.js";
import { PanelGrid } from "./panels.js";

import { showLoading } from "./loading.js";

let canvas;

export function initCanvas() {
  canvas = document.createElement("canvas");
  canvas.id = "hidden-canvas";
}

export function getCanvas() {
  return canvas;
}

export function drawTemplate() {
  showLoading(true);
  // set timeout so loading spinner can show
  setTimeout(() => {
    const makeDoublePage =
      document.getElementById("layout-spread-select").value === "double"
        ? true
        : false;
    let renderedPageData = drawCanvas(makeDoublePage);
    if (document.getElementById("layout-template-select").value === "page") {
      if (
        document.getElementById("layout-page-paper-select").value === "header"
      ) {
        // paper size = header area size
        document.getElementById("result-img").src = canvas.toDataURL();
        showLoading(false);
      } else {
        // a4 210 mm x 297 mm
        let paperWidth = 8.27;
        let paperHeight = 11.69;
        if (
          document.getElementById("layout-page-paper-select").value === "us"
        ) {
          paperWidth = 8.5;
          paperHeight = 11;
        } else if (
          document.getElementById("layout-page-paper-select").value === "b4"
        ) {
          paperWidth = 10.12;
          paperHeight = 14.33;
        } //257 x 364 mm
        else if (
          document.getElementById("layout-page-paper-select").value === "11x17"
        ) {
          paperWidth = 11;
          paperHeight = 17;
        }
        let image = new Image();
        image.onload = function () {
          canvas.width = paperWidth * renderedPageData.ppi;
          canvas.height = paperHeight * renderedPageData.ppi;
          const doScale =
            document.getElementById("layout-page-scaling-select").value ===
            "scale"
              ? true
              : false;
          let pageWidth = renderedPageData.width;
          let pageHeight = renderedPageData.height;
          if (doScale) {
            const widthRatio = canvas.width / pageWidth;
            const heightRatio = canvas.height / pageHeight;
            const ratio = widthRatio < heightRatio ? widthRatio : heightRatio;
            pageWidth = ratio * pageWidth;
            pageHeight = ratio * pageHeight;
          }
          const gapX = canvas.width - pageWidth;
          const gapY = canvas.height - pageHeight;
          // draw the image
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(this, gapX / 2, gapY / 2, pageWidth, pageHeight);

          document.getElementById("result-img").src = canvas.toDataURL();
          showLoading(false);
        };
        image.src = canvas.toDataURL();
      }
    } else {
      let paperWidth = 8.3;
      let paperHeight = 11.7;
      if (
        document.getElementById("layout-thumbnails-paper-select").value === "us"
      ) {
        paperWidth = 8.5;
        paperHeight = 11;
      }
      const numThumbsX = document.getElementById(
        "layout-thumbnails-columns-input"
      ).value;
      const numThumbsY = document.getElementById(
        "layout-thumbnails-rows-input"
      ).value;
      let image = new Image();
      image.onload = function () {
        canvas.width = paperWidth * renderedPageData.ppi;
        canvas.height = paperHeight * renderedPageData.ppi;
        const pageWidth = renderedPageData.width;
        const pageHeight = renderedPageData.height;
        const thumbWidthRatio = canvas.width / numThumbsX / pageWidth;
        const thumbHeightRatio = canvas.height / numThumbsY / pageHeight;
        const thumbRatio =
          thumbWidthRatio < thumbHeightRatio
            ? thumbWidthRatio
            : thumbHeightRatio;
        const thumbWidth = thumbRatio * pageWidth;
        const thumbHeight = thumbRatio * pageHeight;
        const gapX = canvas.width - thumbWidth * numThumbsX;
        const gapY = canvas.height - thumbHeight * numThumbsY;
        // draw the pattern
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let subCanvas = document.createElement("canvas");
        subCanvas.width = thumbWidth;
        subCanvas.height = thumbHeight;
        subCanvas
          .getContext("2d")
          .drawImage(this, 0, 0, subCanvas.width, subCanvas.height);
        ctx.fillStyle = ctx.createPattern(subCanvas, "repeat");
        ctx.translate(gapX / 2, gapY / 2);
        ctx.fillRect(0, 0, thumbWidth * numThumbsX, thumbHeight * numThumbsY);

        document.getElementById("result-img").src = canvas.toDataURL();
        showLoading(false);
      };
      image.src = canvas.toDataURL();
    }
  }, "100");
}

function drawCanvas(makeDoublePage) {
  const ppi = document.getElementById("ppi-input").value;
  const toInches =
    document.getElementById("units-select").value === "inches" ? 1 : 0.393701;

  const lineWidthThin =
    document.getElementById("line-width-thin-input").value * toInches;
  const lineWidthThick =
    document.getElementById("line-width-thick-input").value * toInches;

  let trimWidth = document.getElementById("trim-width-input").value * toInches;
  const trimHeight =
    document.getElementById("trim-height-input").value * toInches;
  const safeMarginTop =
    document.getElementById("safe-margin-top-input").value * toInches;
  const safeMarginBottom =
    document.getElementById("safe-margin-bottom-input").value * toInches;
  const safeMarginLeft =
    document.getElementById("safe-margin-left-input").value * toInches;
  const safeMarginRight =
    document.getElementById("safe-margin-right-input").value * toInches;
  const bleedMargin =
    document.getElementById("bleed-margin-input").value * toInches;
  const headerMarginTopBottom =
    document.getElementById("header-margin-top-bottom-input").value * toInches;
  const headerMarginLeftRight =
    document.getElementById("header-margin-left-right-input").value * toInches;

  const borderMarkMaxLength =
    document.getElementById("border-marks-length-input").value * toInches;
  const headerTextHeight =
    document.getElementById("header-text-height-input").value * toInches;
  const headerPadding =
    document.getElementById("header-padding-input").value * toInches;

  const backGroundColor = document.getElementById(
    "background-color-input"
  ).value;
  const lineColor = document.getElementById("line-color-input").value;
  const lineWidthMultiplier = document.getElementById(
    "line-thickness-select"
  ).value;
  const headerTextWeight = document.getElementById(
    "header-text-weight-select"
  ).value;

  const drawBackground = document.getElementById(
    "paper-draw-bg-checkbox"
  ).checked;
  const drawHeader = document.getElementById(
    "paper-draw-header-checkbox"
  ).checked;
  const drawBleed = document.getElementById("bleed-draw-checkbox").checked;
  const drawTrim = document.getElementById("trim-draw-checkbox").checked;
  const drawSafe = document.getElementById("safe-draw-checkbox").checked;
  const drawBorderMarks = document.getElementById(
    "border-marks-draw-checkbox"
  ).checked;

  const panelPreset = document.getElementById("panel-preset-select").value;
  const panelToInches =
    document.getElementById("panel-units-select").value === "inches"
      ? 1
      : 0.393701;
  const panelGutterSize =
    document.getElementById("panel-gutter-size-input").value * panelToInches;
  const panelLineWidth =
    document.getElementById("panel-line-width-input").value * panelToInches;
  const panelLineColor = document.getElementById(
    "panel-line-color-input"
  ).value;

  if (makeDoublePage) trimWidth *= 2;
  //////////////////////
  // BUILD /////////////
  //////////////////////
  const headerWidth = trimWidth + bleedMargin * 2 + headerMarginLeftRight * 2;
  const headerHeight = trimHeight + bleedMargin * 2 + headerMarginTopBottom * 2;
  const headerRect = new HeaderRect(
    undefined,
    0,
    0,
    headerWidth,
    headerHeight,
    ppi,
    lineWidthThin,
    lineWidthMultiplier,
    drawHeader,
    headerPadding,
    headerTextHeight,
    headerTextWeight
  );
  headerRect.setBorderStyle(0, lineColor, [0, 0]);

  const bleedWidth = trimWidth + bleedMargin * 2;
  const bleedHeight = trimHeight + bleedMargin * 2;
  const bleedX = (headerWidth - bleedWidth) / 2;
  const bleedY = (headerHeight - bleedHeight) / 2;
  const bleedRect = new Rect(
    headerRect,
    bleedX,
    bleedY,
    bleedWidth,
    bleedHeight,
    ppi
  );
  bleedRect.setBorderStyle(
    drawBleed ? lineWidthThick * lineWidthMultiplier : 0,
    lineColor,
    [0, 0]
  );
  headerRect.addChild(bleedRect);

  const trimX = bleedX + bleedMargin;
  const trimY = bleedY + bleedMargin;
  const trimRect = new Rect(
    bleedRect,
    trimX,
    trimY,
    trimWidth,
    trimHeight,
    ppi
  );
  trimRect.setBorderStyle(
    drawTrim ? lineWidthThin * lineWidthMultiplier : 0,
    lineColor,
    [0, 0]
  );
  bleedRect.addChild(trimRect);

  if (makeDoublePage) {
    let safeX = trimX + safeMarginLeft;
    let safeY = trimY + safeMarginTop;
    let safeWidth =
      (trimWidth - safeMarginLeft - safeMarginRight - safeMarginRight * 2) / 2;
    let safeHeight = trimHeight - safeMarginTop - safeMarginBottom;
    let middleMarkPos = trimX + trimWidth / 2;
    const safeRect_1 = new SafeRect(
      trimRect,
      safeX,
      safeY,
      safeWidth,
      safeHeight,
      ppi,
      drawBorderMarks,
      lineWidthThick * lineWidthMultiplier,
      borderMarkMaxLength,
      undefined
    );
    safeRect_1.setBorderStyle(
      drawSafe ? lineWidthThin * lineWidthMultiplier : 0,
      lineColor,
      [safeHeight / 120, safeHeight / 120]
    );
    if (panelPreset > -1)
      safeRect_1.addPanels(
        new PanelGrid(
          safeRect_1,
          panelPreset,
          panelLineWidth,
          panelLineColor,
          panelGutterSize
        )
      );
    trimRect.addChild(safeRect_1);

    safeX = safeX + safeWidth + 2 * safeMarginRight;
    const safeRect_2 = new SafeRect(
      trimRect,
      safeX,
      safeY,
      safeWidth,
      safeHeight,
      ppi,
      drawBorderMarks,
      lineWidthThick * lineWidthMultiplier,
      borderMarkMaxLength,
      middleMarkPos
    );
    safeRect_2.setBorderStyle(
      drawSafe ? lineWidthThin * lineWidthMultiplier : 0,
      lineColor,
      [safeHeight / 120, safeHeight / 120]
    );
    if (panelPreset > -1)
      safeRect_2.addPanels(
        new PanelGrid(
          safeRect_2,
          panelPreset,
          panelLineWidth,
          panelLineColor,
          panelGutterSize
        )
      );
    trimRect.addChild(safeRect_2);
  } else {
    const safeX = trimX + safeMarginLeft;
    const safeY = trimY + safeMarginTop;
    const safeWidth = trimWidth - safeMarginLeft - safeMarginRight;
    const safeHeight = trimHeight - safeMarginTop - safeMarginBottom;
    const safeRect_1 = new SafeRect(
      trimRect,
      safeX,
      safeY,
      safeWidth,
      safeHeight,
      ppi,
      drawBorderMarks,
      lineWidthThick * lineWidthMultiplier,
      borderMarkMaxLength,
      undefined
    );
    safeRect_1.setBorderStyle(
      drawSafe ? lineWidthThin * lineWidthMultiplier : 0,
      lineColor,
      [safeHeight / 120, safeHeight / 120]
    );
    if (panelPreset > -1)
      safeRect_1.addPanels(
        new PanelGrid(
          safeRect_1,
          panelPreset,
          panelLineWidth,
          panelLineColor,
          panelGutterSize
        )
      );
    trimRect.addChild(safeRect_1);
  }

  canvas.width = headerRect.getSize().width * ppi;
  canvas.height = headerRect.getSize().height * ppi;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = drawBackground ? backGroundColor : "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  headerRect.draw(ctx, true);

  return { ppi: ppi, width: canvas.width, height: canvas.height };
}
