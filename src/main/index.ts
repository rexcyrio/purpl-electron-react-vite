import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import cmd from "child_process";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import fs from "fs";
import fswin from "fswin";
import os from "os";
import path from "path";
import icon from "../../resources/icon.png?asset";
import { JSONFileWrapper } from "./JSONFileWrapper";
import { assertTrue, assertTrueAsync } from "./assertion";
import { doesFileExist } from "./doesFileExist";
import { senderIsValid } from "./senderIsValid";

const USERPROFILE = os.homedir();
const WILDCARD = "*";

const THUMBNAIL_UTILITIES_EXE_PATH = is.dev
  ? path.win32.join(
      __dirname,
      "../../external/ThumbnailUtilities/minified-release/ThumbnailUtilities.exe"
    )
  : path.win32.join(
      __dirname,
      "../external/ThumbnailUtilities/minified-release/ThumbnailUtilities.exe"
    );

let MAIN_WINDOW: BrowserWindow;

function createWindow(): void {
  // Create the browser window.
  MAIN_WINDOW = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js")
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
    installDevExtensions();
  } else {
    MAIN_WINDOW.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

async function installDevExtensions(): Promise<void> {
  const electronDevToolsExtension = await import("electron-devtools-installer");

  const installExtension = electronDevToolsExtension.default;
  const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = electronDevToolsExtension;

  Promise.resolve()
    .then(() => installExtension(REACT_DEVELOPER_TOOLS))
    .then(() => installExtension(REDUX_DEVTOOLS))
    .then(() => {
      // MAIN_WINDOW.webContents.openDevTools({ mode: "detach" });
      MAIN_WINDOW.webContents.openDevTools();
    })
    .then(() => {
      console.log("=====\n[EXTENSIONS] installed successfully\n=====\n");
    })
    .catch((error: any) => {
      console.log(`=====\n[EXTENSIONS] an error occurred :: ${error}\n=====\n`);
    });
}

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

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const SETTINGS = new JSONFileWrapper(path.win32.join(__dirname, "settings.json"));

ipcMain.on("QUIT_APP", (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  app.quit();
});

ipcMain.on("OPEN_FILE_EXPLORER", (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  const fullPath = arg;
  cmd.exec(`explorer.exe "${fullPath}"`);
});

ipcMain.on("RUN_QUICK_LOOK", async (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  // use the `QuickLook.exe` that the user provided (if possible)
  if (SETTINGS.exists("quickLookExePath")) {
    const quickLookExePath = SETTINGS.get("quickLookExePath");
    cmd.exec(`"${quickLookExePath}" "${arg}"`);
    return;
  }

  const default_quickLookExePath = path.win32.join(
    USERPROFILE,
    "\\AppData\\Local\\Programs\\QuickLook\\QuickLook.exe"
  );

  if (await doesFileExist(default_quickLookExePath)) {
    SETTINGS.set("quickLookExePath", default_quickLookExePath);
    cmd.exec(`"${default_quickLookExePath}" "${arg}"`);
    return;
  }

  await dialog.showMessageBox(MAIN_WINDOW, {
    message: "QuickLook.exe was not found at its default install location.",
    detail: "Please navigate to QuickLook.exe in the following window.",
    type: "info"
  });

  const { canceled, filePaths } = await dialog.showOpenDialog(MAIN_WINDOW, {
    defaultPath: USERPROFILE,
    filters: [
      { name: "Executable", extensions: ["exe"] },
      { name: "All Files", extensions: ["*"] }
    ],
    properties: ["openFile", "dontAddToRecent"]
  });

  if (canceled) {
    return;
  }

  const user_quickLookExePath = filePaths[0];
  SETTINGS.set("quickLookExePath", user_quickLookExePath);
  cmd.exec(`"${user_quickLookExePath}" "${arg}"`);
});

ipcMain.handle("GET_STARTING_DIRECTORY", async (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  // TODO: check settings
  // return __dirname;
  return "C:\\Users\\Stefan Lee\\Documents\\Development\\purpl-electron-react-vite-2";
});

ipcMain.handle("GET_FS_WIN_DIRECTORY_CONTENTS", async (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  const folderPath = arg;

  await assertTrueAsync(() => {
    return new Promise((resolve, reject) => {
      fswin.getAttributes(folderPath, (result) => {
        if (result?.IS_DIRECTORY) {
          resolve(true);
        }

        resolve(false);
      });
    });
  });

  const folderPathWithTrailingWildcard = path.win32.join(folderPath, WILDCARD);

  return new Promise((resolve, reject) => {
    fswin.find(folderPathWithTrailingWildcard, (files) => {
      resolve(files);
    });
  });
});

ipcMain.handle("GET_LIST_OF_DRIVES", async (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  return new Promise<fswin.LogicalDriveList>((resolve, reject) => {
    fswin.getLogicalDriveList((result) => {
      resolve(result);
    });
  });
});

ipcMain.handle("GET_SMALL_ICON", async (event, filePath: string): Promise<string> => {
  assertTrue(() => senderIsValid(event.senderFrame));

  const icon = await app.getFileIcon(filePath, { size: "normal" });
  const dataUrl = icon.toDataURL();
  return dataUrl;
});

ipcMain.handle("GET_LARGE_ICON", async (event, filePath: string): Promise<string> => {
  assertTrue(() => senderIsValid(event.senderFrame));

  const data = await new Promise<string>((resolve, reject) => {
    const externalChildProcess = cmd.spawn(THUMBNAIL_UTILITIES_EXE_PATH, [filePath, "160"]);

    const bufferArray: Buffer[] = [];

    externalChildProcess.stdout.on("data", (buffer: Buffer) => {
      bufferArray.push(buffer);
    });

    externalChildProcess.stdout.on("close", (code: number, signal: string) => {
      const dataUrlComponents = bufferArray.map((buffer) => buffer.toString("utf8"));
      const dataUrl = dataUrlComponents.join("");
      resolve(dataUrl);
    });

    externalChildProcess.stderr.on("data", async (buffer: Buffer) => {
      // fallback to Electron's `getFileIcon` when ThumbnailUtilities throws an error
      const icon = await app.getFileIcon(filePath, { size: "normal" });
      const dataUrl = icon.toDataURL();
      resolve(dataUrl);
    });
  });

  return data;
});

ipcMain.handle("DOES_FILE_EXIST", async (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  const fullPath = arg;
  return await doesFileExist(fullPath);
});

ipcMain.handle("CREATE_NEW_FOLDER", async (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  const folderPath = arg;
  await fs.promises.mkdir(folderPath);
});

// ============================================================================
// unused
// ============================================================================

ipcMain.handle("MOVE_ITEM", async (event, arg) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  const { from_fullPath, to_fullPath } = arg;
  // TODO: remove
  throw new Error(Date.now().toString());

  await fs.promises.rename(from_fullPath, to_fullPath);
});

ipcMain.on("ondragstart", (event, filePath) => {
  assertTrue(() => senderIsValid(event.senderFrame));

  console.log("dragging start");
  event.sender.startDrag({
    file: filePath,
    icon: icon
  });
});
