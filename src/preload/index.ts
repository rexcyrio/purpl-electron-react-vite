import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type fswin from "fswin";

// invoke   = asynchronous +    response
// send     = asynchronous + NO response
// sendSync =  synchronous +    response

// Custom APIs for renderer
export const api = {
  quitApp: (): void => {
    ipcRenderer.send("QUIT_APP");
  },
  openFileExplorer: (folderPath: string): void => {
    ipcRenderer.send("OPEN_FILE_EXPLORER", folderPath);
  },
  runQuickLook: (fullPath: string): void => {
    ipcRenderer.send("RUN_QUICK_LOOK", fullPath);
  },
  getStartingDirectory: async (): Promise<string> => {
    return await ipcRenderer.invoke("GET_STARTING_DIRECTORY");
  },
  getFsWinDirectoryContents: async (folderPath: string): Promise<fswin.Find.File[]> => {
    return await ipcRenderer.invoke("GET_FS_WIN_DIRECTORY_CONTENTS", folderPath);
  },
  getListOfDrives: async (): Promise<fswin.LogicalDriveList> => {
    return await ipcRenderer.invoke("GET_LIST_OF_DRIVES");
  },
  doesFileExist: async (fullPath: string): Promise<boolean> => {
    return await ipcRenderer.invoke("DOES_FILE_EXIST", fullPath);
  },
  createNewFolder: async (folderPath: string): Promise<void> => {
    return await ipcRenderer.invoke("CREATE_NEW_FOLDER", folderPath);
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
