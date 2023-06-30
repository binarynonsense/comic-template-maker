/**
 * @license
 * Copyright 2023 Álvaro García
 * SPDX-License-Identifier: BSD-2-Clause
 */

export function initModals() {
  window.addEventListener("load", function () {
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        closeOpenModal();
      }
    });
  });
}

export function openModal(id) {
  document.getElementById(id).classList.add("modal-open");
}

export function closeOpenModal() {
  document.querySelector(".modal-open").classList.remove("modal-open");
}

// ref: https://stackblitz.com/edit/vanilla-js-css-modal-popup-example?file=index.html
