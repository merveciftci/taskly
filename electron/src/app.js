import { app, BrowserWindow, nativeImage } from "electron";
import { join } from "path";
import isDev from 'electron-is-dev';
import { serve } from "./index.js";

const defaultAppIcon = nativeImage.createFromPath(
  join(app.getAppPath(), "assets", "icon.png")
);

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    icon: defaultAppIcon,
    title: "Taskly",

    minWidth: 320,
    minHeight: 640,
  });

  await serve(mainWindow);

  mainWindow.maximize();

  if (isDev) {
    mainWindow.webContents.openDevTools({ activate: false, mode: "right" });
  }
};

export const init = async () => {
  await createWindow();
};
