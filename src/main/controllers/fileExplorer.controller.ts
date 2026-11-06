import { ipcMain } from "electron";
import { z } from "zod";
import withAllMiddlewares from "../middlewares/withAllMiddlewares";
import FileExplorerService from "../services/fileExplorer.service";
import IRegisterHandles from "./IRegisterHandles";
import { formatAsOk } from "../responses/responses";

export default class FileExplorerController implements IRegisterHandles {
  private fileExplorerService: FileExplorerService;

  constructor() {
    this.fileExplorerService = new FileExplorerService();
  }

  registerHandles(): void {
    ipcMain.handle("OPEN_FILE_EXPLORER", withAllMiddlewares(this.openFileExplorer));
    ipcMain.handle("CREATE_NEW_FOLDER", withAllMiddlewares(this.createNewFolder));
    ipcMain.handle("MOVE_ITEM", withAllMiddlewares(this.moveItem));
  }

  openFileExplorer = (event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
    const folderPath = z.string().parse(args[0]);

    this.fileExplorerService.openFileExplorer(folderPath);
    return formatAsOk(true);
  };

  createNewFolder = (event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
    const folderPath = z.string().parse(args[0]);

    this.fileExplorerService.createNewFolder(folderPath);
    return formatAsOk(true);
  };

  moveItem = (event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
    const fromFullPath = z.string().parse(args[0]);
    const toFullPath = z.string().parse(args[1]);

    this.fileExplorerService.moveItem(fromFullPath, toFullPath);
    return formatAsOk(true);
  };
}
