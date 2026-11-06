import { ipcMain } from "electron";
import { z } from "zod";
import withAllMiddlewares from "../middlewares/withAllMiddlewares";
import { formatAsOk } from "../responses/responses";
import QuickLookService from "../services/quickLook.service";
import IRegisterHandles from "./IRegisterHandles";

export default class QuickLookController implements IRegisterHandles {
  private quickLookService: QuickLookService;

  constructor() {
    this.quickLookService = new QuickLookService();
  }

  registerHandles(): void {
    ipcMain.handle("RUN_QUICK_LOOK", withAllMiddlewares(this.runQuickLook));
  }

  runQuickLook = async (event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
    const fullPath = z.string().parse(args[0]);

    await this.quickLookService.runQuickLook(fullPath);
    return formatAsOk(true);
  };
}
