import { initCanvas, drawTemplate } from "./draw.js";
import { initPresets, setPreset } from "./presets.js";
import { initSaveLoad } from "./save-load.js";
import { initView, resetView } from "./view.js";

const version = "1.0.0";

init();

function init() {
  initCanvas();
  initPresets(version);
  initSaveLoad();
  initView();
  drawTemplate();
}

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
        if (document.getElementById("autorefresh-checkbox").checked) {
          drawTemplate();
          resetView();
        }
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
