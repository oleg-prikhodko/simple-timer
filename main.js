const { app, Tray, BrowserWindow } = require("electron");

let win = null;
function createWindow(trayIconOffset) {
  const windowWidth = 200;
  const windowHeight = 200;
  const yOffset = 0;
  const xOffset = trayIconOffset - windowWidth / 2;
  win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: xOffset,
    y: yOffset,
    center: false,
    movable: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    frame: false,
    show: false,
    transparent: true,
    titleBarStyle: "default",
    vibrancy: "popover"
  });
  win.addListener("blur", () => {
    win.hide();
  });
  win.loadFile("index.html");
}

let tray = null;
app.on("ready", () => {
  // use electron-builer to never show it in the first place
  // https://github.com/electron-userland/electron-builder/issues/1456#issuecomment-293518692
  app.dock.hide();

  tray = new Tray("clock.png");
  tray.setToolTip("Simple timer");

  tray.addListener("click", (event, bounds, position) => {
    if (!win) {
      createWindow(bounds.x + bounds.height / 2);
      win.once("ready-to-show", () => {
        win.show();
      });
    } else if (!win.isVisible()) {
      win.show();
    }
  });
});
