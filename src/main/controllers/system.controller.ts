import { ipcMain } from "electron";
import withAllMiddlewares from "../middlewares/withAllMiddlewares";
import { formatAsOk } from "../responses/responses";
import SystemService from "../services/system.service";
import IRegisterHandles from "./IRegisterHandles";

export default class SystemController implements IRegisterHandles {
  private systemService: SystemService;

  constructor() {
    this.systemService = new SystemService();
  }

  registerHandles(): void {
    ipcMain.handle("QUIT_APP", withAllMiddlewares(this.quitApp));
  }

  quitApp = (event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
    this.systemService.quitApp();
    return formatAsOk(true);
  };
}
