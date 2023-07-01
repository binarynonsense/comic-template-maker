/**
 * @license
 * Copyright 2023 Álvaro García
 * www.binarynonsense.com
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { showLoading } from "./loading.js";
import { drawTemplate, getCanvas } from "./draw.js";
import {
  loadPresetFromJson,
  setPreset,
  getPresetFromCurrentValues,
  loadGridPresetFromJson,
  setGridPreset,
  getGridPresetFromCurrentValues,
} from "./presets.js";
import { openModal, closeOpenModal } from "./modals.js";

export function initSaveLoad() {
  let canvas = getCanvas();
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
  // template presets import/export
  document
    .getElementById("open-modal-export-preset-button")
    .addEventListener("click", function () {
      openModal("export-preset-modal");
    });
  document
    .getElementById("export-preset-button")
    .addEventListener("click", function () {
      let name = document.getElementById("export-preset-name-input").value;
      savePresetFileFromCurrentValues(name);
      closeOpenModal();
    });

  document
    .getElementById("open-modal-import-preset-button")
    .addEventListener("click", function () {
      openModal("import-preset-modal");
    });
  document
    .getElementById("import-preset-button")
    .addEventListener("click", function () {
      document.getElementById("import-preset-file-input").click();
      closeOpenModal();
    });
  document
    .getElementById("import-preset-file-input")
    .addEventListener("change", function () {
      const file = document.getElementById("import-preset-file-input").files[0];
      let reader = new FileReader();
      reader.onload = function (e) {
        let index = loadPresetFromJson(JSON.parse(e.target.result));
        if (document.getElementById("import-preset-apply-checkbox").checked) {
          setPreset(-1); // load all defaults
          setPreset(index - 1);
          if (document.getElementById("autorefresh-checkbox").checked)
            drawTemplate();
        }
      };
      reader.readAsText(file);
    });

  // grid presets import/export
  document
    .getElementById("open-modal-export-grid-preset-button")
    .addEventListener("click", function () {
      openModal("export-grid-preset-modal");
    });
  document
    .getElementById("export-grid-preset-button")
    .addEventListener("click", function () {
      let name = document.getElementById("export-grid-preset-name-input").value;
      saveGridPresetFileFromCurrentValues(name);
      closeOpenModal();
    });

  document
    .getElementById("open-modal-import-grid-preset-button")
    .addEventListener("click", function () {
      openModal("import-grid-preset-modal");
    });
  document
    .getElementById("import-grid-preset-button")
    .addEventListener("click", function () {
      document.getElementById("import-grid-preset-file-input").click();
      closeOpenModal();
    });
  document
    .getElementById("import-grid-preset-file-input")
    .addEventListener("change", function () {
      const file = document.getElementById("import-grid-preset-file-input")
        .files[0];
      let reader = new FileReader();
      reader.onload = function (e) {
        let index = loadGridPresetFromJson(JSON.parse(e.target.result));
        if (
          document.getElementById("import-grid-preset-apply-checkbox").checked
        ) {
          setGridPreset(index - 1);
          if (document.getElementById("autorefresh-checkbox").checked)
            drawTemplate();
        }
      };
      reader.readAsText(file);
    });
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

function savePresetFileFromCurrentValues(name) {
  let preset = getPresetFromCurrentValues(name);
  saveToFile(
    JSON.stringify(preset, null, 2),
    "template-preset.json",
    "text/plain"
  );
}

function saveGridPresetFileFromCurrentValues(name) {
  let preset = getGridPresetFromCurrentValues(name);
  saveToFile(JSON.stringify(preset, null, 2), "grid-preset.json", "text/plain");
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
