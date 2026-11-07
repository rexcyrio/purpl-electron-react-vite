import { contextBridge, ipcRenderer } from "electron";
import type fswin from "fswin";

interface HttpLikeResponse<T> {
  status: number;
  message: string;
  data: T;
}

// NOTE: invoke() = asynchronous + response

export const api = {
  quitApp: async (): Promise<HttpLikeResponse<boolean>> => {
    return await ipcRenderer.invoke("QUIT_APP");
  },
  openFileExplorer: async (folderPath: string): Promise<HttpLikeResponse<boolean>> => {
    return await ipcRenderer.invoke("OPEN_FILE_EXPLORER", folderPath);
  },
  runQuickLook: async (fullPath: string): Promise<HttpLikeResponse<boolean>> => {
    return await ipcRenderer.invoke("RUN_QUICK_LOOK", fullPath);
  },
  // startDrag: async (fullPath: string): Promise<HttpLikeResponse<boolean>> => {
  //   return await ipcRenderer.invoke("START_DRAG", fullPath);
  // },
  getStartingDirectory: async (): Promise<HttpLikeResponse<string>> => {
    return await ipcRenderer.invoke("GET_STARTING_DIRECTORY");
  },
  getFsWinDirectoryContents: async (
    folderPath: string
  ): Promise<HttpLikeResponse<fswin.Find.File[]>> => {
    // TODO: change channel name
    return await ipcRenderer.invoke("GET_FS_WIN_DIRECTORY_CONTENTS", folderPath);
  },
  getListOfDrives: async (): Promise<HttpLikeResponse<fswin.LogicalDriveList>> => {
    return await ipcRenderer.invoke("GET_LIST_OF_DRIVES");
  },
  getSmallIcon: async (filePath: string): Promise<HttpLikeResponse<string>> => {
    return await ipcRenderer.invoke("GET_SMALL_ICON", filePath);
  },
  getLargeIcon: async (filePath: string): Promise<HttpLikeResponse<string>> => {
    return await ipcRenderer.invoke("GET_LARGE_ICON", filePath);
  },
  createNewFolder: async (folderPath: string): Promise<HttpLikeResponse<boolean>> => {
    return await ipcRenderer.invoke("CREATE_NEW_FOLDER", folderPath);
  }
};

contextBridge.exposeInMainWorld("api", api);
