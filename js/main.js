import { Rect } from "./rect.js";
import { SafeRect } from "./safe-rect.js";
import { HeaderRect as HeaderRect } from "./header-rect.js";
import { PanelGrid } from "./panels.js";

import preset_1 from "../presets/american-1.js";
// not supported by firefox:
// import preset_1 from "../presets/american-1-single.json" assert { type: "json" };
// import preset_2 from "../presets/american-1-double.json" assert { type: "json" };

const version = "1.0.0";
let canvas;
let presets;

init();
drawTemplate();

function init() {
  canvas = document.createElement("canvas");
  canvas.id = "hidden-canvas";
  presets = [];
  document.getElementById("info-version-p").innerHTML = `version: ${version}`;
  const select = document.getElementById("preset-select");
  let opt = document.createElement("option");
  opt.value = 0;
  opt.innerHTML = "custom";
  select.appendChild(opt);
  loadPresetFromJson(preset_1);
  setPreset(0);
}

function loadPresetFromJson(preset) {
  const select = document.getElementById("preset-select");
  // sanitize /////
  preset.name = sanitizeString(preset.name);
  // TODO: check version is valid
  preset.presetFormatVersion = sanitizeVersion(preset.presetFormatVersion);
  preset.units = sanitizeString(preset.units);

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
  /////////////////
  let opt = document.createElement("option");
  opt.value = select.childElementCount;
  opt.textContent = preset.name;
  select.appendChild(opt);
  presets.push(preset);
  return opt.value;
}

function sanitizeString(input) {
  if (typeof input !== "string") {
    return "???";
  }
  return input;
}
function sanitizeNumber(input) {
  let value = Number(input);
  if (typeof value !== "number") {
    console.log("not a number " + value);
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

function setPreset(index) {
  const preset = presets[index];

  document.getElementById("units-select").value = preset.units;

  document.getElementById("trim-width-input").value = preset.trimWidth;
  document.getElementById("trim-height-input").value = preset.trimHeight;
  document.getElementById("bleed-margin-input").value = preset.bleedMargin;
  document.getElementById("safe-margin-top-input").value = preset.safeMarginTop;
  document.getElementById("safe-margin-bottom-input").value =
    preset.safeMarginBottom;
  document.getElementById("safe-margin-left-input").value =
    preset.safeMarginLeft;
  document.getElementById("safe-margin-right-input").value =
    preset.safeMarginRight;
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

  document.getElementById("preset-select").value = index + 1;
}

function getPresetFromCurrentValues(name, author) {
  const preset = { ...presets[1] };

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
  preset.bleedWidth = document.getElementById("bleed-margin-input").value;
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
      document.getElementById("layout-select").value === "double"
        ? true
        : false;
    drawCanvas(makeDoublePage);
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

  document.getElementById("result-img").src = canvas.toDataURL();

  showLoading(false);
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
    if (
      document.getElementById("save-template-format-select").value === "png"
    ) {
      saveBase64AsFile(canvas.toDataURL(), "template.png");
    } else {
      saveBase64AsFile(canvas.toDataURL("image/jpeg"), "template.jpg");
    }
  });

function savePresetFileFromCurrentValues(name) {
  let preset = getPresetFromCurrentValues(name);
  saveToFile(JSON.stringify(preset), "preset.json", "text/plain");
}
document
  .getElementById("save-preset-button")
  .addEventListener("click", function () {
    let name = document.getElementById("save-preset-name-input").value;
    savePresetFileFromCurrentValues(name);
  });

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
}

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
        setPreset(event.target.value - 1);
        if (document.getElementById("autorefresh-checkbox").checked)
          drawTemplate();
      }
    } else {
      if (event.target.classList.contains("preset-value")) {
        document.getElementById("preset-select").value = 0;
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
