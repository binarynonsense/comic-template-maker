import { Rect } from "./rect.js";
import { SafeRect } from "./safe-rect.js";
import { HeaderRect as HeaderRect } from "./header-rect.js";
import { PanelGrid } from "./panels.js";

import preset_1 from "../presets/american-comic-1.js";
import preset_2 from "../presets/american-comic-1-double.js";
import preset_3 from "../presets/thumbs-american-single-1.js";
import preset_4 from "../presets/thumbs-american-double-1.js";
import preset_5 from "../presets/american-comic-2.js";
import preset_6 from "../presets/american-comic-2-double.js";
import preset_7 from "../presets/american-manga-1.js";
import preset_8 from "../presets/japanese-manga-1.js";
import preset_9 from "../presets/six-by-nine-1.js";
// not supported by firefox:
// import preset_1 from "../presets/american-1.json" assert { type: "json" };

const version = "1.0.0";
let canvas;
let presets;

init();
drawTemplate();

function init() {
  canvas = document.createElement("canvas");
  canvas.id = "hidden-canvas";
  presets = [];
  document.getElementById("info-version-p").innerHTML = `${version}`;
  const select = document.getElementById("preset-select");
  let opt = document.createElement("option");
  opt.disabled = true;
  opt.value = 0;
  opt.innerHTML = "custom";
  select.appendChild(opt);
  loadPresetFromJson(preset_1);
  loadPresetFromJson(preset_2);
  loadPresetFromJson(preset_3);
  loadPresetFromJson(preset_4);
  loadPresetFromJson(preset_5);
  loadPresetFromJson(preset_6);
  loadPresetFromJson(preset_7);
  loadPresetFromJson(preset_8);
  loadPresetFromJson(preset_9);
  setPreset(0);
}

function loadPresetFromJson(preset) {
  const select = document.getElementById("preset-select");
  // sanitize /////
  preset.name = sanitizeString(preset.name, "comic book");
  // TODO: check version is valid
  preset.presetFormatVersion = sanitizeVersion(preset.presetFormatVersion);
  //////////////// dimensions ///////////////////////////
  preset.units = sanitizeString(preset.units, "inches", ["inches", "cm"]);

  preset.trimWidth = sanitizeNumber(preset.trimWidth);
  preset.trimHeight = sanitizeNumber(preset.trimHeight);
  preset.safeMarginTop = sanitizeNumber(preset.safeMarginTop);
  preset.safeMarginBottom = sanitizeNumber(preset.safeMarginBottom);
  preset.safeMarginLeft = sanitizeNumber(preset.safeMarginLeft);
  preset.safeMarginRight = sanitizeNumber(preset.safeMarginRight);
  preset.bleedMargin = sanitizeNumber(preset.bleedMargin);
  preset.headerMarginTopBottom = sanitizeNumber(preset.headerMarginTopBottom);
  preset.headerMarginLeftRight = sanitizeNumber(preset.headerMarginLeftRight);

  preset.lineWidthThin = sanitizeNumber(preset.lineWidthThin);
  preset.lineWidthThick = sanitizeNumber(preset.lineWidthThick);
  preset.borderMarkMaxLength = sanitizeNumber(preset.borderMarkMaxLength);
  preset.headerTextHeight = sanitizeNumber(preset.headerTextHeight);
  preset.headerPadding = sanitizeNumber(preset.headerPadding);
  //////////////// rendering ///////////////////////////
  // preset.renderBackgroundColor // TODO sanitize color
  // preset.renderLineColor
  if (preset.renderLineWidth !== undefined)
    preset.renderLineWidth = sanitizeNumber(preset.renderLineWidth);
  if (preset.renderHeaderTextWidth !== undefined)
    preset.renderHeaderTextWidth = sanitizeNumber(preset.renderLineWidth);
  if (preset.renderDrawBackground !== undefined)
    preset.renderDrawBackground = sanitizeBool(preset.renderDrawBackground);
  if (preset.renderDrawHeader !== undefined)
    preset.renderDrawHeader = sanitizeBool(preset.renderDrawHeader);
  if (preset.renderDrawBleed !== undefined)
    preset.renderDrawBleed = sanitizeBool(preset.renderDrawBleed);
  if (preset.renderDrawSafe !== undefined)
    preset.renderDrawSafe = sanitizeBool(preset.renderDrawSafe);
  if (preset.renderDrawMarks !== undefined)
    preset.renderDrawMarks = sanitizeBool(preset.renderDrawMarks);
  /////////////////
  let opt = document.createElement("option");
  opt.value = select.childElementCount;
  opt.textContent = preset.name;
  select.appendChild(opt);
  presets.push(preset);
  return opt.value;
}

function sanitizeString(input, defaultString, validStrings) {
  let isValid = true;
  if (typeof input !== "string") {
    isValid = false;
  } else if (validStrings) {
    isValid = false;
    for (let index = 0; index < validStrings.length; index++) {
      if (input === validStrings[index]) {
        isValid = true;
        break;
      }
    }
  }
  if (isValid) {
    return input;
  } else {
    return defaultString;
  }
}
function sanitizeNumber(input) {
  let value = Number(input);
  if (typeof value !== "number") {
    return 0;
  }
  return value;
}
function sanitizeBool(input) {
  if (typeof input !== "boolean") {
    return false;
  }
  return input;
}
function sanitizeVersion(input) {
  if (typeof input !== "string") {
    return "0.0.0";
  }
  if (!separateVersionText(input)) {
    return "0.0.0";
  }
  return input;
}

function separateVersionText(version) {
  const regex =
    /^(?<major>[0-9]+)\.(?<minor>[0-9]+)\.(?<patch>[0-9]+)(-beta(?<beta>[0-9]+))*$/;
  let match = version.match(regex);
  if (match === null) return undefined;
  return match.groups;
}

function isVersionOlder(testVersion, referenceVersion) {
  const test = separateVersionText(testVersion);
  const reference = separateVersionText(referenceVersion);
  if (test === undefined || reference === undefined) return true;
  if (test.major < reference.major) return true;
  if (test.minor < reference.minor) return true;
  if (test.patch < reference.patch) return true;
  if (test.beta !== undefined) {
    if (reference.beta === undefined) return true;
    if (test.beta < reference.beta) return true;
  }
  return false;
}

function setPreset(index, updateSelect = true) {
  const preset = presets[index];
  //////////////// dimensions ///////////////////////////
  document.getElementById("units-select").value = preset.units;

  document.getElementById("trim-width-input").value = preset.trimWidth;
  document.getElementById("trim-height-input").value = preset.trimHeight;
  document.getElementById("safe-margin-top-input").value = preset.safeMarginTop;
  document.getElementById("safe-margin-bottom-input").value =
    preset.safeMarginBottom;
  document.getElementById("safe-margin-left-input").value =
    preset.safeMarginLeft;
  document.getElementById("safe-margin-right-input").value =
    preset.safeMarginRight;
  document.getElementById("bleed-margin-input").value = preset.bleedMargin;
  document.getElementById("header-margin-top-bottom-input").value =
    preset.headerMarginTopBottom;
  document.getElementById("header-margin-left-right-input").value =
    preset.headerMarginLeftRight;

  document.getElementById("line-width-thin-input").value = preset.lineWidthThin;
  document.getElementById("line-width-thick-input").value =
    preset.lineWidthThick;
  document.getElementById("border-marks-length-input").value =
    preset.borderMarkMaxLength;
  document.getElementById("header-text-height-input").value =
    preset.headerTextHeight;
  document.getElementById("header-padding-input").value = preset.headerPadding;
  //////////////// rendering ///////////////////////////
  if (preset.renderBackgroundColor !== undefined) {
    document.getElementById("background-color-input").value =
      preset.renderBackgroundColor;
  }
  if (preset.renderLineColor !== undefined) {
    document.getElementById("line-color-input").value = preset.renderLineColor;
  }
  if (preset.renderLineWidth !== undefined) {
    document.getElementById("line-thickness-select").value =
      preset.renderLineWidth;
  }
  if (preset.renderHeaderTextWidth !== undefined) {
    document.getElementById("header-text-weight-select").value =
      preset.renderHeaderTextWidth;
  }

  if (preset.renderDrawBackground !== undefined) {
    document.getElementById("paper-draw-bg-checkbox").checked =
      preset.renderDrawBackground;
  }
  if (preset.renderDrawHeader !== undefined) {
    document.getElementById("paper-draw-header-checkbox").checked =
      preset.renderDrawHeader;
  }
  if (preset.renderDrawBleed !== undefined) {
    document.getElementById("bleed-draw-checkbox").checked =
      preset.renderDrawBleed;
  }
  if (preset.renderDrawTrim !== undefined) {
    document.getElementById("trim-draw-checkbox").checked =
      preset.renderDrawTrim;
  }
  if (preset.renderDrawSafe !== undefined) {
    document.getElementById("safe-draw-checkbox").checked =
      preset.renderDrawSafe;
  }
  if (preset.renderDrawMarks !== undefined) {
    document.getElementById("border-marks-draw-checkbox").checked =
      preset.renderDrawMarks;
  }
  //////////////// panels ///////////////////////////
  if (preset.panelsPreset !== undefined) {
    document.getElementById("panel-preset-select").value = preset.panelsPreset;
  }
  if (preset.panelsUnits !== undefined) {
    document.getElementById("panel-units-select").value = preset.panelsUnits;
  }
  if (preset.panelsGutterSize !== undefined) {
    document.getElementById("panel-gutter-size-input").value =
      preset.panelsGutterSize;
  }
  if (preset.panelsLineWidth !== undefined) {
    document.getElementById("panel-line-width-input").value =
      preset.panelsLineWidth;
  }
  if (preset.panelsLineColor !== undefined) {
    document.getElementById("panel-line-color-input").value =
      preset.panelsLineColor;
  }
  //////////////// layout ///////////////////////////
  if (preset.layoutPageSpread !== undefined) {
    document.getElementById("layout-spread-select").value =
      preset.layoutPageSpread;
  }
  if (preset.layoutPpi !== undefined) {
    document.getElementById("ppi-input").value = preset.layoutPpi;
  }
  if (preset.layoutTemplateType !== undefined) {
    document.getElementById("layout-template-select").value =
      preset.layoutTemplateType;
    if (document.getElementById("layout-template-select").value === "page") {
      document.getElementById("layout-page-div").classList.remove("hidden");
      document.getElementById("layout-thumbnails-div").classList.add("hidden");
    } else {
      document.getElementById("layout-page-div").classList.add("hidden");
      document
        .getElementById("layout-thumbnails-div")
        .classList.remove("hidden");
    }
  }
  if (preset.layoutPagePaperSize !== undefined) {
    document.getElementById("layout-page-paper-select").value =
      preset.layoutPagePaperSize;
  }
  if (preset.layoutPageScaling !== undefined) {
    document.getElementById("layout-page-scaling-select").value =
      preset.layoutPageScaling;
  }
  if (preset.layoutThumbnailsRows !== undefined) {
    document.getElementById("layout-thumbnails-rows-input").value =
      preset.layoutThumbnailsRows;
  }
  if (preset.layoutThumbnailsColumns !== undefined) {
    document.getElementById("layout-thumbnails-columns-input").value =
      preset.layoutThumbnailsColumns;
  }
  if (preset.layoutThumbnailsPaperSize !== undefined) {
    document.getElementById("layout-thumbnails-paper-select").value =
      preset.layoutThumbnailsPaperSize;
  }
  //////////////////////////////////////////////////
  if (updateSelect) document.getElementById("preset-select").value = index + 1;
}

function getPresetFromCurrentValues(name, author) {
  const preset = { ...presets[1] };
  //////////////// dimensions ///////////////////////////
  preset.units = document.getElementById("units-select").value;

  preset.trimWidth = document.getElementById("trim-width-input").value;
  preset.trimHeight = document.getElementById("trim-height-input").value;
  preset.safeMarginTop = document.getElementById("safe-margin-top-input").value;
  preset.safeMarginBottom = document.getElementById(
    "safe-margin-bottom-input"
  ).value;
  preset.safeMarginLeft = document.getElementById(
    "safe-margin-left-input"
  ).value;
  preset.safeMarginRight = document.getElementById(
    "safe-margin-right-input"
  ).value;
  preset.bleedMargin = document.getElementById("bleed-margin-input").value;
  preset.headerMarginTopBottom = document.getElementById(
    "header-margin-top-bottom-input"
  ).value;
  preset.headerMarginLeftRight = document.getElementById(
    "header-margin-left-right-input"
  ).value;

  preset.lineWidthThin = document.getElementById("line-width-thin-input").value;
  preset.lineWidthThick = document.getElementById(
    "line-width-thick-input"
  ).value;

  preset.borderMarkMaxLength = document.getElementById(
    "border-marks-length-input"
  ).value;
  preset.headerTextHeight = document.getElementById(
    "header-text-height-input"
  ).value;
  preset.headerPadding = document.getElementById("header-padding-input").value;
  //////////////// rendering ///////////////////////////
  if (document.getElementById("save-preset-rendering-checkbox").checked) {
    preset.renderBackgroundColor = document.getElementById(
      "background-color-input"
    ).value;
    preset.renderLineColor = document.getElementById("line-color-input").value;
    preset.renderLineWidth = document.getElementById(
      "line-thickness-select"
    ).value;
    preset.renderHeaderTextWidth = document.getElementById(
      "header-text-weight-select"
    ).value;
    preset.renderDrawBackground = document.getElementById(
      "paper-draw-bg-checkbox"
    ).checked;
    preset.renderDrawHeader = document.getElementById(
      "paper-draw-header-checkbox"
    ).checked;
    preset.renderDrawBleed = document.getElementById(
      "bleed-draw-checkbox"
    ).checked;
    preset.renderDrawTrim =
      document.getElementById("trim-draw-checkbox").checked;
    preset.renderDrawSafe =
      document.getElementById("safe-draw-checkbox").checked;
    preset.renderDrawMarks = document.getElementById(
      "border-marks-draw-checkbox"
    ).checked;
  }
  //////////////// panels ///////////////////////////
  if (document.getElementById("save-preset-panels-checkbox").checked) {
    preset.panelsPreset = document.getElementById("panel-preset-select").value;
    preset.panelsUnits = document.getElementById("panel-units-select").value;
    preset.panelsGutterSize = document.getElementById(
      "panel-gutter-size-input"
    ).value;
    preset.panelsLineWidth = document.getElementById(
      "panel-line-width-input"
    ).value;
    preset.panelsLineColor = document.getElementById(
      "panel-line-color-input"
    ).value;
  }
  //////////////// layout ///////////////////////////
  if (document.getElementById("save-preset-layout-checkbox").checked) {
    preset.layoutPageSpread = document.getElementById(
      "layout-spread-select"
    ).value;
    preset.layoutPpi = document.getElementById("ppi-input").value;
    preset.layoutTemplateType = document.getElementById(
      "layout-template-select"
    ).value;
    preset.layoutPagePaperSize = document.getElementById(
      "layout-page-paper-select"
    ).value;
    preset.layoutPageScaling = document.getElementById(
      "layout-page-scaling-select"
    ).value;
    preset.layoutThumbnailsRows = document.getElementById(
      "layout-thumbnails-rows-input"
    ).value;
    preset.layoutThumbnailsColumns = document.getElementById(
      "layout-thumbnails-columns-input"
    ).value;
    preset.layoutThumbnailsPaperSize = document.getElementById(
      "layout-thumbnails-paper-select"
    ).value;
  }
  //////////////////////////////////////////////////////
  preset.name = name;
  return preset;
}

function showLoading(show) {
  if (show) {
    document.querySelector("#loading").classList.add("is-active");
  } else {
    document.querySelector("#loading").classList.remove("is-active");
  }
}

function drawTemplate() {
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

function saveBase64AsFile(base64, fileName) {
  let link = document.createElement("a");
  document.body.appendChild(link);
  link.setAttribute("type", "hidden");
  link.href = base64;
  link.download = fileName;
  link.click();
  document.body.removeChild(link);
}

document
  .getElementById("save-template-button")
  .addEventListener("click", function () {
    showLoading(true);
    // set timeout so loading spinner can show
    setTimeout(() => {
      if (
        document.getElementById("save-template-format-select").value === "png"
      ) {
        saveBase64AsFile(canvas.toDataURL(), "template.png");
        showLoading(false);
      } else if (
        document.getElementById("save-template-format-select").value === "jpg"
      ) {
        saveBase64AsFile(canvas.toDataURL("image/jpeg"), "template.jpg");
        showLoading(false);
      } else if (
        document.getElementById("save-template-format-select").value === "pdf"
      ) {
        const pdf = new PDFDocument({
          autoFirstPage: false,
        });
        const stream = pdf.pipe(blobStream());
        const imgBase64 = canvas.toDataURL("image/jpeg");
        const img = pdf.openImage(imgBase64);
        pdf.addPage({
          margin: 0,
          size: [canvas.width, canvas.height],
        });
        pdf.image(img, 0, 0, { scale: 1 });
        pdf.end();

        const link = document.createElement("a");
        document.body.appendChild(link);
        link.setAttribute("type", "hidden");

        stream.on("finish", function () {
          let blob = stream.toBlob("application/pdf");
          if (blob) {
            let url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = "template.pdf";
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            showLoading(false);
          }
        });
      }
    }, "100");
  });

function savePresetFileFromCurrentValues(name) {
  let preset = getPresetFromCurrentValues(name);
  saveToFile(JSON.stringify(preset), "preset.json", "text/plain");
}
// TODO: merge with base64 version?
function saveToFile(content, fileName, contentType) {
  let link = document.createElement("a");
  document.body.appendChild(link);
  link.setAttribute("type", "hidden");
  var file = new Blob([content], { type: contentType });
  link.href = URL.createObjectURL(file);
  link.download = fileName;
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}

document
  .getElementById("save-preset-button")
  .addEventListener("click", function () {
    let name = document.getElementById("save-preset-name-input").value;
    savePresetFileFromCurrentValues(name);
  });
document
  .getElementById("load-preset-button")
  .addEventListener("click", function () {
    document.getElementById("load-preset-file-input").click();
  });
document
  .getElementById("load-preset-file-input")
  .addEventListener("change", function () {
    const file = document.getElementById("load-preset-file-input").files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      let index = loadPresetFromJson(JSON.parse(e.target.result));
      if (document.getElementById("load-preset-apply-checkbox").checked) {
        if (index - 1 !== 0) setPreset(0, false); // load all defaults
        setPreset(index - 1);
        if (true || document.getElementById("autorefresh-checkbox").checked)
          drawTemplate();
      }
    };
    reader.readAsText(file);
  });

document
  .getElementById("refresh-button")
  .addEventListener("click", function () {
    drawTemplate();
  });

let refreshable = document.querySelectorAll(".refresh");
for (let i = 0; i < refreshable.length; i++) {
  refreshable[i].addEventListener("change", function (event) {
    // console.log(event.target.id);
    if (event.target.id === "preset-select") {
      if (event.target.value != 0) {
        if (event.target.value - 1 !== 0) setPreset(0, false); // load all defaults
        setPreset(event.target.value - 1);
        if (document.getElementById("autorefresh-checkbox").checked)
          drawTemplate();
      }
    } else {
      if (event.target.classList.contains("preset-value")) {
        document.getElementById("preset-select").value = 0;
      } else if (event.target.id === "layout-template-select") {
        if (
          document.getElementById("layout-template-select").value === "page"
        ) {
          document.getElementById("layout-page-div").classList.remove("hidden");
          document
            .getElementById("layout-thumbnails-div")
            .classList.add("hidden");
        } else {
          document.getElementById("layout-page-div").classList.add("hidden");
          document
            .getElementById("layout-thumbnails-div")
            .classList.remove("hidden");
        }
      }
      if (document.getElementById("autorefresh-checkbox").checked)
        drawTemplate();
    }
  });
}

const tab1 = document.getElementById("tab-1");
const tab1Content = document.getElementById("tab-1-content");
const tab2 = document.getElementById("tab-2");
const tab2Content = document.getElementById("tab-2-content");
const tab3 = document.getElementById("tab-3");
const tab3Content = document.getElementById("tab-3-content");
const tab4 = document.getElementById("tab-4");
const tab4Content = document.getElementById("tab-4-content");
const tab5 = document.getElementById("tab-5");
const tab5Content = document.getElementById("tab-5-content");
const tab6 = document.getElementById("tab-6");
const tab6Content = document.getElementById("tab-6-content");
tab1.addEventListener("click", function () {
  if (!tab1.classList.contains("tab-selected")) {
    tab1.classList.add("tab-selected");
    tab1Content.classList.remove("hidden");
    tab2.classList.remove("tab-selected");
    tab2Content.classList.add("hidden");
    tab3.classList.remove("tab-selected");
    tab3Content.classList.add("hidden");
    tab4.classList.remove("tab-selected");
    tab4Content.classList.add("hidden");
    tab5.classList.remove("tab-selected");
    tab5Content.classList.add("hidden");
    tab6.classList.remove("tab-selected");
    tab6Content.classList.add("hidden");
  }
});
tab2.addEventListener("click", function () {
  if (!tab2.classList.contains("tab-selected")) {
    tab1.classList.remove("tab-selected");
    tab1Content.classList.add("hidden");
    tab2.classList.add("tab-selected");
    tab2Content.classList.remove("hidden");
    tab3.classList.remove("tab-selected");
    tab3Content.classList.add("hidden");
    tab4.classList.remove("tab-selected");
    tab4Content.classList.add("hidden");
    tab5.classList.remove("tab-selected");
    tab5Content.classList.add("hidden");
    tab6.classList.remove("tab-selected");
    tab6Content.classList.add("hidden");
  }
});
tab3.addEventListener("click", function () {
  if (!tab3.classList.contains("tab-selected")) {
    tab1.classList.remove("tab-selected");
    tab1Content.classList.add("hidden");
    tab2.classList.remove("tab-selected");
    tab2Content.classList.add("hidden");
    tab3.classList.add("tab-selected");
    tab3Content.classList.remove("hidden");
    tab4.classList.remove("tab-selected");
    tab4Content.classList.add("hidden");
    tab5.classList.remove("tab-selected");
    tab5Content.classList.add("hidden");
    tab6.classList.remove("tab-selected");
    tab6Content.classList.add("hidden");
  }
});
tab4.addEventListener("click", function () {
  if (!tab4.classList.contains("tab-selected")) {
    tab1.classList.remove("tab-selected");
    tab1Content.classList.add("hidden");
    tab2.classList.remove("tab-selected");
    tab2Content.classList.add("hidden");
    tab3.classList.remove("tab-selected");
    tab3Content.classList.add("hidden");
    tab4.classList.add("tab-selected");
    tab4Content.classList.remove("hidden");
    tab5.classList.remove("tab-selected");
    tab5Content.classList.add("hidden");
    tab6.classList.remove("tab-selected");
    tab6Content.classList.add("hidden");
  }
});
tab5.addEventListener("click", function () {
  if (!tab5.classList.contains("tab-selected")) {
    tab1.classList.remove("tab-selected");
    tab1Content.classList.add("hidden");
    tab2.classList.remove("tab-selected");
    tab2Content.classList.add("hidden");
    tab3.classList.remove("tab-selected");
    tab3Content.classList.add("hidden");
    tab4.classList.remove("tab-selected");
    tab4Content.classList.add("hidden");
    tab5.classList.add("tab-selected");
    tab5Content.classList.remove("hidden");
    tab6.classList.remove("tab-selected");
    tab6Content.classList.add("hidden");
  }
});
tab6.addEventListener("click", function () {
  if (!tab6.classList.contains("tab-selected")) {
    tab1.classList.remove("tab-selected");
    tab1Content.classList.add("hidden");
    tab2.classList.remove("tab-selected");
    tab2Content.classList.add("hidden");
    tab3.classList.remove("tab-selected");
    tab3Content.classList.add("hidden");
    tab4.classList.remove("tab-selected");
    tab4Content.classList.add("hidden");
    tab5.classList.remove("tab-selected");
    tab5Content.classList.add("hidden");
    tab6.classList.add("tab-selected");
    tab6Content.classList.remove("hidden");
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

// ref: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineDashOffset
// ref: https://en.wikipedia.org/wiki/Non-photo_blue
