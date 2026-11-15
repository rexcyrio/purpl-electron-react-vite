import { ipcMain } from "electron";
import { z } from "zod";
import withAllMiddlewares from "../middlewares/withAllMiddlewares";
import withAllMiddlewaresAsync from "../middlewares/withAllMiddlewaresAsync";
import { formatAsOk } from "../responses/responses";
import FileExplorerService from "../services/fileExplorer.service";
import IRegisterHandles from "./IRegisterHandles";

export default class FileExplorerController implements IRegisterHandles {
  private fileExplorerService: FileExplorerService;

  constructor() {
    this.fileExplorerService = new FileExplorerService();
  }

  registerHandles(): void {
    ipcMain.handle("OPEN_FILE_EXPLORER", withAllMiddlewares(this.openFileExplorer));
    ipcMain.handle("CREATE_NEW_FOLDER", withAllMiddlewaresAsync(this.createNewFolder));
    ipcMain.handle("MOVE_ITEM", withAllMiddlewaresAsync(this.moveItem));
  }

  openFileExplorer = (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => {
    const folderPath = z.string().parse(args[0]);

    this.fileExplorerService.openFileExplorer(folderPath);
    return formatAsOk(true);
  };

  createNewFolder = async (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => {
    const folderPath = z.string().parse(args[0]);

    await this.fileExplorerService.createNewFolder(folderPath);
    return formatAsOk(true);
  };

  moveItem = async (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => {
    const fromFullPath = z.string().parse(args[0]);
    const toFullPath = z.string().parse(args[1]);

    await this.fileExplorerService.moveItem(fromFullPath, toFullPath);
    return formatAsOk(true);
  };
}
