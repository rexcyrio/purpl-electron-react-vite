import { contextBridge, ipcRenderer } from "electron";
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
  getSmallIcon: async (filePath: string): Promise<string> => {
    return await ipcRenderer.invoke("GET_SMALL_ICON", filePath);
  },
  getLargeIcon: async (filePath: string): Promise<string> => {
    return await ipcRenderer.invoke("GET_LARGE_ICON", filePath);
  },
  doesFileExist: async (fullPath: string): Promise<boolean> => {
    return await ipcRenderer.invoke("DOES_FILE_EXIST", fullPath);
  },
  createNewFolder: async (folderPath: string): Promise<void> => {
    return await ipcRenderer.invoke("CREATE_NEW_FOLDER", folderPath);
  }
};

contextBridge.exposeInMainWorld("api", api);
