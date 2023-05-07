import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      invoke: (channel: string, data: any) => Promise<any>;
      sendSync: (channel: string, data: any) => any;
      send: (channel: string, data: any) => void;
    };
  }
}
