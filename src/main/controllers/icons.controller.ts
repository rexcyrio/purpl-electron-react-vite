import { ipcMain } from "electron";
import { z } from "zod";
import withAllMiddlewares from "../middlewares/withAllMiddlewares";
import { formatAsOk } from "../responses/responses";
import IconsService from "../services/icons.service";
import IRegisterHandles from "./IRegisterHandles";

export default class IconsController implements IRegisterHandles {
  private iconsService: IconsService;

  constructor() {
    this.iconsService = new IconsService();
  }

  registerHandles(): void {
    ipcMain.handle("GET_SMALL_ICON", withAllMiddlewares(this.getSmallIcon));
    ipcMain.handle("GET_LARGE_ICON", withAllMiddlewares(this.getLargeIcon));
  }

  getSmallIcon = (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => {
    const fullPath = z.string().parse(args[0]);

    const dataUrl = this.iconsService.getSmallIcon(fullPath);
    return formatAsOk(dataUrl);
  };

  getLargeIcon = (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => {
    const fullPath = z.string().parse(args[0]);

    const dataUrl = this.iconsService.getLargeIcon(fullPath);
    return formatAsOk(dataUrl);
  };
}
