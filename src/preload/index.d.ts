import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      /**
       * Asynchronously resolves with a response from the main process.
       */
      invoke: (channel: string, data: any) => Promise<any>;

      /**
       * Synchronously resolves with a response from the main process.
       */
      sendSync: (channel: string, data: any) => any;

      /**
       * Sends an asynchronous message to the main process.
       */
      send: (channel: string, data: any) => void;
    };
  }
}
