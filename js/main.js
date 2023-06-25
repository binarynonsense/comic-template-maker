import { Rect } from "./rect.js";
import { SafeRect } from "./safe-rect.js";
import { PaperRect as PaperRect } from "./paper-rect.js";
import { PanelGrid } from "./panels.js";

import preset_1 from "../presets/american-1-single.js";
import preset_2 from "../presets/american-1-double.js";
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
  loadPresetFromJson(preset_2);
  setPreset(0);
}

function loadPresetFromJson(preset) {
  const select = document.getElementById("preset-select");
  let opt = document.createElement("option");
  opt.value = select.childElementCount;
  opt.innerHTML = preset.name;
  select.appendChild(opt);
  presets.push(preset);
  return opt.value;
}

function setPreset(index) {
  const preset = presets[index];

  document.getElementById("units-select").value = preset.units;
  document.getElementById("double-page-checkbox").checked = preset.isDoublePage;

  document.getElementById("paper-width-input").value = preset.paperWidth;
  document.getElementById("paper-height-input").value = preset.paperHeight;
  document.getElementById("bleed-width-input").value = preset.bleedWidth;
  document.getElementById("bleed-height-input").value = preset.bleedHeight;
  document.getElementById("trim-width-input").value = preset.trimWidth;
  document.getElementById("trim-height-input").value = preset.trimHeight;
  document.getElementById("safe-width-input").value = preset.safeWidth;
  document.getElementById("safe-height-input").value = preset.safeHeight;

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
  preset.isDoublePage = document.getElementById("double-page-checkbox").checked;

  preset.paperWidth = document.getElementById("paper-width-input").value;
  preset.paperHeight = document.getElementById("paper-height-input").value;
  preset.bleedWidth = document.getElementById("bleed-width-input").value;
  preset.bleedHeight = document.getElementById("bleed-height-input").value;
  preset.trimWidth = document.getElementById("trim-width-input").value;
  preset.trimHeight = document.getElementById("trim-height-input").value;
  preset.safeWidth = document.getElementById("safe-width-input").value;
  preset.safeHeight = document.getElementById("safe-height-input").value;

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
    drawCanvas();
  }, "100");
}

function drawCanvas() {
  const ppi = document.getElementById("ppi-input").value;
  const toInches =
    document.getElementById("units-select").value === "inches" ? 1 : 0.393701;
  const isDoublePage = document.getElementById("double-page-checkbox").checked;

  const lineWidthThin =
    document.getElementById("line-width-thin-input").value * toInches;
  const lineWidthThick =
    document.getElementById("line-width-thick-input").value * toInches;

  const paperWidth =
    document.getElementById("paper-width-input").value * toInches;
  const paperHeight =
    document.getElementById("paper-height-input").value * toInches;
  const bleedWidth =
    document.getElementById("bleed-width-input").value * toInches;
  const bleedHeight =
    document.getElementById("bleed-height-input").value * toInches;
  const trimWidth =
    document.getElementById("trim-width-input").value * toInches;
  const trimHeight =
    document.getElementById("trim-height-input").value * toInches;
  const safeWidth =
    document.getElementById("safe-width-input").value * toInches;
  const safeHeight =
    document.getElementById("safe-height-input").value * toInches;

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
    document.getElementById("panel-gutter-size-input").value * toInches;
  const panelLineWidth =
    document.getElementById("panel-line-width-input").value * toInches;
  const panelLineColor = document.getElementById(
    "panel-line-color-input"
  ).value;
  //////////////////////
  // BUILD /////////////
  //////////////////////
  const paperRect = new PaperRect(
    undefined,
    paperWidth,
    paperHeight,
    ppi,
    lineWidthThin,
    lineWidthMultiplier,
    drawHeader,
    headerPadding,
    headerTextHeight,
    headerTextWeight
  );
  paperRect.setBorderStyle(0, lineColor, [0, 0]);

  const bleedRect = new Rect(paperRect, bleedWidth, bleedHeight, ppi);
  bleedRect.setBorderStyle(
    drawBleed ? lineWidthThick * lineWidthMultiplier : 0,
    lineColor,
    [0, 0]
  );
  paperRect.addChild(bleedRect);

  const trimRect = new Rect(bleedRect, trimWidth, trimHeight, ppi);
  trimRect.setBorderStyle(
    drawTrim ? lineWidthThin * lineWidthMultiplier : 0,
    lineColor,
    [0, 0]
  );
  bleedRect.addChild(trimRect);

  const safeRect_1 = new SafeRect(
    trimRect,
    safeWidth,
    safeHeight,
    ppi,
    drawBorderMarks,
    lineWidthThick * lineWidthMultiplier,
    borderMarkMaxLength,
    isDoublePage ? 1 : 0
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
        panelLineWidth * panelToInches,
        panelLineColor,
        panelGutterSize * panelToInches
      )
    );
  trimRect.addChild(safeRect_1);

  if (isDoublePage) {
    const safeRect_2 = new SafeRect(
      trimRect,
      safeWidth,
      safeHeight,
      ppi,
      drawBorderMarks,
      lineWidthThick * lineWidthMultiplier,
      borderMarkMaxLength,
      2
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
          panelLineWidth * panelToInches,
          panelLineColor,
          panelGutterSize * panelToInches
        )
      );
    trimRect.addChild(safeRect_2);
  }

  canvas.width = paperRect.getSize().width * ppi;
  canvas.height = paperRect.getSize().height * ppi;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = drawBackground ? backGroundColor : "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  paperRect.draw(ctx, true);

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
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

// ref: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineDashOffset
// ref: https://en.wikipedia.org/wiki/Non-photo_blue
