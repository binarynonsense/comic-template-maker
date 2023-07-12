/**
 * @license
 * Copyright 2023 Álvaro García
 * www.binarynonsense.com
 * SPDX-License-Identifier: BSD-2-Clause
 */

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let g_mainWindow;

function isDev() {
  return process.argv[2] == "--dev";
}

const createWindow = () => {
  g_mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets/images/icon_256x256.png"),
  });

  g_mainWindow.loadFile("./src/index.html");
};

app.whenReady().then(() => {
  createWindow();
  // macos
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  g_mainWindow.webContents.setWindowOpenHandler((details) => {
    require("electron").shell.openExternal(details.url);
    return { action: "deny" };
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("dev-tools-pressed", (event) => {
  if (isDev()) g_mainWindow.toggleDevTools();
});

// refs:
// https://www.electronjs.org/docs/latest/tutorial/quick-start
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
