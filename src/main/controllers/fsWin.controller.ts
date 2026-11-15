import { ipcMain } from "electron";
import { z } from "zod";
import withAllMiddlewaresAsync from "../middlewares/withAllMiddlewaresAsync";
import { formatAsOk } from "../responses/responses";
import FsWinService from "../services/fsWin.service";
import IRegisterHandles from "./IRegisterHandles";

export default class FsWinController implements IRegisterHandles {
  private fsWinService: FsWinService;

  constructor() {
    this.fsWinService = new FsWinService();
  }

  registerHandles(): void {
    ipcMain.handle("GET_LIST_OF_DRIVES", withAllMiddlewaresAsync(this.getListOfDrives));
    // TODO: rename channel name
    ipcMain.handle("GET_FS_WIN_DIRECTORY_CONTENTS", withAllMiddlewaresAsync(this.getDirectoryContents));
  }

  getListOfDrives = async (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => {
    const data = await this.fsWinService.getListOfDrives();

    return formatAsOk(data);
  };

  getDirectoryContents = async (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => {
    const folderPath = z.string().parse(args[0]);

    const data = await this.fsWinService.getDirectoryContents(folderPath);
    return formatAsOk(data);
  };
}
