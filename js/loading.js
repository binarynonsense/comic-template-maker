/**
 * @license
 * Copyright 2023 Álvaro García
 * SPDX-License-Identifier: BSD-2-Clause
 */

export function showLoading(show) {
  if (show) {
    document.querySelector("#loading").classList.add("is-active");
  } else {
    document.querySelector("#loading").classList.remove("is-active");
  }
}
