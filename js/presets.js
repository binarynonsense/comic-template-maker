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

let presets;

export function initPresets(version) {
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

export function loadPresetFromJson(preset) {
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
  if (preset.renderBackgroundColor !== undefined)
    preset.renderBackgroundColor = sanitizeColor(preset.renderBackgroundColor);
  if (preset.renderLineColor !== undefined)
    preset.renderLineColor = sanitizeColor(preset.renderLineColor);
  if (preset.renderLineWidth !== undefined)
    preset.renderLineWidth = sanitizeNumber(preset.renderLineWidth);
  if (preset.renderHeaderTextWeight !== undefined)
    preset.renderHeaderTextWeight = sanitizeString(preset.renderLineWidth);
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

export function setPreset(index, updateSelect = true) {
  const preset = presets[index];
  //////////////// dimensions ///////////////////////////
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
  if (preset.headerPadding !== undefined) {
    document.getElementById("header-padding-input").value =
      preset.headerPadding;
  }
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

export function getPresetFromCurrentValues(name, author) {
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
