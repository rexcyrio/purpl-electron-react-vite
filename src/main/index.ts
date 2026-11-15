import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain, nativeImage, session, shell } from "electron";
import { Jimp } from "jimp";
import os from "os";
import path from "path";
import icon from "../../resources/icon.png?asset";
import { assertTrue } from "./assertions/assertions";
import FileExplorerController from "./controllers/fileExplorer.controller";
import FsWinController from "./controllers/fsWin.controller";
import IconsController from "./controllers/icons.controller";
import IRegisterHandles from "./controllers/IRegisterHandles";
import QuickLookController from "./controllers/quickLook.controller";
import SystemController from "./controllers/system.controller";

export let MAIN_WINDOW: BrowserWindow;

function createMainWindow() {
  // Create the browser window.
  MAIN_WINDOW = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false
    }
  });

  MAIN_WINDOW.on("ready-to-show", () => {
    MAIN_WINDOW.show();
  });

  MAIN_WINDOW.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    MAIN_WINDOW.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    installDeveloperExtensions();
  } else {
    MAIN_WINDOW.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

async function installDeveloperExtensions() {
  const extensions = [
    {
      name: "React Developer Tools",
      id: "fmkadmapgofadopljbjfkapdkoienihi",
      version: "8.0.0_0"
    },
    {
      name: "Redux DevTools",
      id: "lmhkpmbekcpmknklioeibfkpmmfibljd",
      version: "3.2.12_0"
    }
  ];

  for (const extension of extensions) {
    const fullPath = path.join(
      os.homedir(),
      "AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions",
      extension.id,
      extension.version
    );

    try {
      await session.defaultSession.extensions.loadExtension(fullPath);
      console.log(`\n*** ${extension.name} installed successfully ***\n`);
    } catch (error) {
      console.error(`\n*** ${extension.name} failed to install due to: ***\n`, error);
    }
  }

  MAIN_WINDOW.webContents.openDevTools();
}

async function sleep(ms: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

// fix cursor disappearing on text input fields
app.disableHardwareAcceleration();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createMainWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function registerControllerHandles() {
  const controllers: IRegisterHandles[] = [
    new FileExplorerController(),
    new FsWinController(),
    new IconsController(),
    new QuickLookController(),
    new SystemController()
  ];

  for (const controller of controllers) {
    controller.registerHandles();
  }
}

function bootstrap() {
  registerControllerHandles();
}

bootstrap();

// TODO:
ipcMain.on("START_DRAG", async (event, fullPath: string) => {
  assertTrue(senderIsValid(event.senderFrame));

  const displayName = fullPath.split(path.win32.sep).at(-1);

  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  const horizontalPadding = 5;
  const verticalPadding = 3;

  const width = 140;
  const height = Jimp.measureTextHeight(font, "abc", 100) + 2 * verticalPadding;

  new Jimp(width, height, "#0068d9", async (error, image) => {
    if (error) {
      throw error;
    }

    image.print(font, horizontalPadding, verticalPadding, displayName);

    const dataUrl = await image.getBase64Async(Jimp.MIME_PNG);
    const myNativeImage = nativeImage.createFromDataURL(dataUrl);

    event.sender.startDrag({
      file: fullPath,
      icon: myNativeImage
    });
  });
});
