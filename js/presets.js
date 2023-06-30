/**
 * @license
 * Copyright 2023 Álvaro García
 * www.binarynonsense.com
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { exportGridPreset } from "./panels.js";

import preset_0 from "../presets/default.js";
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

let g_presets;
let g_defaultPreset;

export function initPresets(version) {
  g_presets = [];
  g_defaultPreset = preset_0;
  loadPresetFromJson(g_defaultPreset, false);
  document.getElementById("info-version-p").innerHTML = `${version}`;
  const select = document.getElementById("preset-select");
  let opt = document.createElement("option");
  opt.disabled = true;
  opt.selected = true;
  opt.value = 0;
  opt.innerHTML = "select a preset";
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
  setPreset(-1);
}

export function loadPresetFromJson(preset, addToList = true) {
  const select = document.getElementById("preset-select");
  // sanitize /////
  preset.name = sanitizeString(preset.name, "comic book");
  // TODO: check version is valid
  preset.presetFormatVersion = sanitizeVersion(preset.presetFormatVersion);
  //////////////// dimensions ///////////////////////////
  if (preset.units !== undefined)
    preset.units = sanitizeString(preset.units, "inches", ["inches", "cm"]);

  if (preset.trimWidth !== undefined)
    preset.trimWidth = sanitizeNumber(preset.trimWidth);
  if (preset.trimHeight !== undefined)
    preset.trimHeight = sanitizeNumber(preset.trimHeight);
  if (preset.safeMarginTop !== undefined)
    preset.safeMarginTop = sanitizeNumber(preset.safeMarginTop);
  if (preset.safeMarginBottom !== undefined)
    preset.safeMarginBottom = sanitizeNumber(preset.safeMarginBottom);
  if (preset.safeMarginLeft !== undefined)
    preset.safeMarginLeft = sanitizeNumber(preset.safeMarginLeft);
  if (preset.safeMarginRight !== undefined)
    preset.safeMarginRight = sanitizeNumber(preset.safeMarginRight);
  if (preset.bleedMargin !== undefined)
    preset.bleedMargin = sanitizeNumber(preset.bleedMargin);
  if (preset.headerMarginTopBottom !== undefined)
    preset.headerMarginTopBottom = sanitizeNumber(preset.headerMarginTopBottom);
  if (preset.headerMarginLeftRight !== undefined)
    preset.headerMarginLeftRight = sanitizeNumber(preset.headerMarginLeftRight);

  if (preset.panelsGutterSize !== undefined)
    preset.panelsGutterSize = sanitizeNumber(preset.panelsGutterSize);
  if (preset.panelsLineWidth !== undefined)
    preset.panelsLineWidth = sanitizeNumber(preset.panelsLineWidth);

  if (preset.lineWidthThin !== undefined)
    preset.lineWidthThin = sanitizeNumber(preset.lineWidthThin);
  if (preset.lineWidthThick !== undefined)
    preset.lineWidthThick = sanitizeNumber(preset.lineWidthThick);
  if (preset.borderMarkMaxLength !== undefined)
    preset.borderMarkMaxLength = sanitizeNumber(preset.borderMarkMaxLength);
  if (preset.headerTextHeight !== undefined)
    preset.headerTextHeight = sanitizeNumber(preset.headerTextHeight);
  if (preset.headerPaddingBottom !== undefined)
    preset.headerPaddingBottom = sanitizeNumber(preset.headerPaddingBottom);
  if (preset.headerPaddingLeft !== undefined)
    preset.headerPaddingLeft = sanitizeNumber(preset.headerPaddingLeft);
  //////////////// rendering ///////////////////////////
  if (preset.renderBackgroundColor !== undefined)
    preset.renderBackgroundColor = sanitizeColor(preset.renderBackgroundColor);
  if (preset.renderLineColor !== undefined)
    preset.renderLineColor = sanitizeColor(preset.renderLineColor);
  if (preset.renderLineWeight !== undefined)
    preset.renderLineWeight = sanitizeString(preset.renderLineWeight);
  if (preset.panelsLineColor !== undefined)
    preset.panelsLineColor = sanitizeString(preset.panelsLineColor);
  if (preset.panelGuidesColor !== undefined)
    preset.panelGuidesColor = sanitizeString(preset.panelGuidesColor);
  if (preset.renderHeaderTextWeight !== undefined)
    preset.renderHeaderTextWeight = sanitizeString(
      preset.renderHeaderTextWeight
    );

  if (preset.renderDrawBackground !== undefined)
    preset.renderDrawBackground = sanitizeBool(preset.renderDrawBackground);
  if (preset.renderDrawHeader !== undefined)
    preset.renderDrawHeader = sanitizeBool(preset.renderDrawHeader);
  if (preset.renderDrawBleed !== undefined)
    preset.renderDrawBleed = sanitizeBool(preset.renderDrawBleed);
  if (preset.renderDrawTrim !== undefined)
    preset.renderDrawTrim = sanitizeBool(preset.renderDrawTrim);
  if (preset.renderDrawSafe !== undefined)
    preset.renderDrawSafe = sanitizeBool(preset.renderDrawSafe);
  if (preset.renderDrawMarks !== undefined)
    preset.renderDrawMarks = sanitizeBool(preset.renderDrawMarks);
  if (preset.renderDrawCropMarks !== undefined)
    preset.renderDrawCropMarks = sanitizeBool(preset.renderDrawCropMarks);
  if (preset.renderDrawPanelGuides !== undefined)
    preset.renderDrawPanelGuides = sanitizeBool(preset.renderDrawPanelGuides);
  if (preset.renderDrawPanels !== undefined)
    preset.renderDrawPanels = sanitizeBool(preset.renderDrawPanels);
  //////////////// panels ///////////////////////////

  //////////////// layout ///////////////////////////
  if (preset.layoutPageSpread !== undefined)
    preset.layoutPageSpread = sanitizeString(preset.layoutPageSpread);
  if (preset.layoutPpi !== undefined)
    preset.layoutPpi = sanitizeNumber(preset.layoutPpi);
  if (preset.layoutTemplateType !== undefined)
    preset.layoutTemplateType = sanitizeString(preset.layoutTemplateType);

  if (preset.layoutPagePaperSize !== undefined)
    preset.layoutPagePaperSize = sanitizeString(preset.layoutPagePaperSize);
  if (preset.layoutPageScaling !== undefined)
    preset.layoutPageScaling = sanitizeString(preset.layoutPageScaling);

  if (preset.layoutThumbnailsRows !== undefined)
    preset.layoutThumbnailsRows = sanitizeNumber(preset.layoutThumbnailsRows);
  if (preset.layoutThumbnailsColumns !== undefined)
    preset.layoutThumbnailsColumns = sanitizeNumber(
      preset.layoutThumbnailsColumns
    );
  if (preset.layoutThumbnailsPaperSize !== undefined)
    preset.layoutThumbnailsPaperSize = sanitizeString(
      preset.layoutThumbnailsPaperSize
    );
  /////////////////
  if (addToList) {
    let opt = document.createElement("option");
    opt.value = select.childElementCount;
    opt.textContent = preset.name;
    select.appendChild(opt);
    g_presets.push(preset);
    return opt.value;
  }
}

// Sanitize ///////////////////////////////////////////////////////

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
    return undefined;
  }
  return value;
}
function sanitizeBool(input) {
  if (typeof input !== "boolean") {
    return undefined;
  }
  return input;
}
function sanitizeColor(input) {
  let regex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
  if (typeof input !== "string" || !regex.test(input)) {
    return undefined;
  }
  return input;
}
function sanitizeVersion(input) {
  if (typeof input !== "string") {
    return undefined;
  }
  if (!separateVersionText(input)) {
    return undefined;
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

export function setPreset(index, checkUI = false) {
  let preset;
  if (index < 0 || index >= g_presets.length) {
    preset = g_defaultPreset;
  } else {
    preset = g_presets[index];
  }
  //////////////// dimensions ///////////////////////////
  if (
    !checkUI ||
    document.getElementById("select-preset-dimensions-checkbox").checked
  ) {
    if (preset.units !== undefined) {
      document.getElementById("units-select").value = preset.units;
    }
    if (preset.trimWidth !== undefined) {
      document.getElementById("trim-width-input").value = preset.trimWidth;
    }
    if (preset.trimHeight !== undefined) {
      document.getElementById("trim-height-input").value = preset.trimHeight;
    }
    if (preset.safeMarginTop !== undefined) {
      document.getElementById("safe-margin-top-input").value =
        preset.safeMarginTop;
    }
    if (preset.safeMarginBottom !== undefined) {
      document.getElementById("safe-margin-bottom-input").value =
        preset.safeMarginBottom;
    }
    if (preset.safeMarginLeft !== undefined) {
      document.getElementById("safe-margin-left-input").value =
        preset.safeMarginLeft;
    }
    if (preset.safeMarginRight !== undefined) {
      document.getElementById("safe-margin-right-input").value =
        preset.safeMarginRight;
    }
    if (preset.bleedMargin !== undefined) {
      document.getElementById("bleed-margin-input").value = preset.bleedMargin;
    }
    if (preset.headerMarginTopBottom !== undefined) {
      document.getElementById("header-margin-top-bottom-input").value =
        preset.headerMarginTopBottom;
    }
    if (preset.headerMarginLeftRight !== undefined) {
      document.getElementById("header-margin-left-right-input").value =
        preset.headerMarginLeftRight;
    }

    if (preset.panelsGutterSize !== undefined) {
      document.getElementById("panel-gutter-size-input").value =
        preset.panelsGutterSize;
    }
    if (preset.panelsLineWidth !== undefined) {
      document.getElementById("panel-line-width-input").value =
        preset.panelsLineWidth;
    }

    if (preset.lineWidthThin !== undefined) {
      document.getElementById("line-width-thin-input").value =
        preset.lineWidthThin;
    }
    if (preset.lineWidthThick !== undefined) {
      document.getElementById("line-width-thick-input").value =
        preset.lineWidthThick;
    }
    if (preset.borderMarkMaxLength !== undefined) {
      document.getElementById("border-marks-length-input").value =
        preset.borderMarkMaxLength;
    }
    if (preset.headerTextHeight !== undefined) {
      document.getElementById("header-text-height-input").value =
        preset.headerTextHeight;
    }
    if (preset.headerPaddingBottom !== undefined) {
      document.getElementById("header-padding-bottom-input").value =
        preset.headerPaddingBottom;
    }
    if (preset.headerPaddingLeft !== undefined) {
      document.getElementById("header-padding-left-input").value =
        preset.headerPaddingLeft;
    }
  }
  //////////////// rendering ///////////////////////////
  if (
    !checkUI ||
    document.getElementById("select-preset-rendering-checkbox").checked
  ) {
    if (preset.renderBackgroundColor !== undefined) {
      document.getElementById("background-color-input").value =
        preset.renderBackgroundColor;
    }
    if (preset.renderLineColor !== undefined) {
      document.getElementById("line-color-input").value =
        preset.renderLineColor;
    }
    if (preset.renderLineWeight !== undefined) {
      document.getElementById("line-thickness-select").value =
        preset.renderLineWeight;
    }
    if (preset.panelsLineColor !== undefined) {
      document.getElementById("panel-line-color-input").value =
        preset.panelsLineColor;
    }
    if (preset.panelGuidesColor !== undefined) {
      document.getElementById("panel-guides-color-input").value =
        preset.panelGuidesColor;
    }
    if (preset.renderHeaderTextWeight !== undefined) {
      document.getElementById("header-text-weight-select").value =
        preset.renderHeaderTextWeight;
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
    if (preset.renderDrawCropMarks !== undefined) {
      document.getElementById("crop-marks-draw-checkbox").checked =
        preset.renderDrawCropMarks;
    }
    if (preset.renderDrawPanelGuides !== undefined) {
      document.getElementById("panel-guides-draw-checkbox").checked =
        preset.renderDrawPanelGuides;
    }
    if (preset.renderDrawPanels !== undefined) {
      document.getElementById("panels-draw-checkbox").checked =
        preset.renderDrawPanels;
    }
  }
  //////////////// panels ///////////////////////////
  if (
    !checkUI ||
    document.getElementById("select-preset-panels-checkbox").checked
  ) {
  }
  //////////////// layout ///////////////////////////
  if (
    !checkUI ||
    document.getElementById("select-preset-layout-checkbox").checked
  ) {
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
  }
  //////////////////////////////////////////////////
}

export function getPresetFromCurrentValues(name) {
  const preset = { ...g_defaultPreset }; // load defaults
  preset.name = name;
  //////////////// dimensions ///////////////////////////
  if (document.getElementById("save-preset-dimensions-checkbox").checked) {
    preset.units = document.getElementById("units-select").value;

    preset.trimWidth = document.getElementById("trim-width-input").value;
    preset.trimHeight = document.getElementById("trim-height-input").value;
    preset.safeMarginTop = document.getElementById(
      "safe-margin-top-input"
    ).value;
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

    preset.panelsGutterSize = document.getElementById(
      "panel-gutter-size-input"
    ).value;
    preset.panelsLineWidth = document.getElementById(
      "panel-line-width-input"
    ).value;

    preset.lineWidthThin = document.getElementById(
      "line-width-thin-input"
    ).value;
    preset.lineWidthThick = document.getElementById(
      "line-width-thick-input"
    ).value;
    preset.borderMarkMaxLength = document.getElementById(
      "border-marks-length-input"
    ).value;
    preset.headerTextHeight = document.getElementById(
      "header-text-height-input"
    ).value;
    preset.headerPaddingBottom = document.getElementById(
      "header-padding-bottom-input"
    ).value;
    preset.headerPaddingLeft = document.getElementById(
      "header-padding-left-input"
    ).value;
  }
  //////////////// rendering ///////////////////////////
  if (document.getElementById("save-preset-rendering-checkbox").checked) {
    preset.renderBackgroundColor = document.getElementById(
      "background-color-input"
    ).value;
    preset.renderLineColor = document.getElementById("line-color-input").value;
    preset.renderLineWeight = document.getElementById(
      "line-thickness-select"
    ).value;
    preset.panelsLineColor = document.getElementById(
      "panel-line-color-input"
    ).value;
    preset.panelGuidesColor = document.getElementById(
      "panel-guides-color-input"
    ).value;
    preset.renderHeaderTextWeight = document.getElementById(
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
    preset.renderDrawCropMarks = document.getElementById(
      "crop-marks-draw-checkbox"
    ).checked;
    preset.renderDrawPanelGuides = document.getElementById(
      "panel-guides-draw-checkbox"
    ).checked;
    preset.renderDrawPanels = document.getElementById(
      "panels-draw-checkbox"
    ).checked;
  }
  //////////////// panels ///////////////////////////
  if (true || document.getElementById("save-preset-panels-checkbox").checked) {
    preset.panelGrid = exportGridPreset();
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
  return preset;
}
