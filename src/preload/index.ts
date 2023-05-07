import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  // asynchronous + response
  invoke: async (channel: string, data: any): Promise<any> => {
    return await ipcRenderer.invoke(channel, data);
  },
  // synchronous + response
  sendSync: (channel: string, data: any): any => {
    return ipcRenderer.sendSync(channel, data);
  },
  // asynchronous + NO response
  send: (channel: string, data: any): void => {
    ipcRenderer.send(channel, data);
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
