import { app, shell } from "electron";
import { init } from "./app.js";
import electronServe from "electron-serve";
import { join } from "path";

export const serve = electronServe({
  directory: join(app.getAppPath(), "app"),
});

app.on("ready", async () => {
  await init();
});

app.on("web-contents-created", (event, webContents) => {
  webContents.on("will-navigate", (event, url) => {
    // Check if it's an external link
    if (!url.startsWith("app://")) {
      // assuming 'app://' is your app's protocol
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  webContents.setWindowOpenHandler(({ url }) => {
    // This catches links that would open in a new window
    shell.openExternal(url);
    return { action: "deny" };
  });
});
