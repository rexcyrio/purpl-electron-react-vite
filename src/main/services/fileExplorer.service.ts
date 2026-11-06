import cmd from "child_process";
import fs from "fs";

export default class FileExplorerService {
  openFileExplorer(folderPath: string) {
    cmd.exec(`explorer.exe "${folderPath}"`);
  }

  async createNewFolder(folderPath: string) {
    await fs.promises.mkdir(folderPath);
  }

  async moveItem(fromFullPath: string, toFullPath: string) {
    // TODO:
    throw new Error(Date.now().toString());

    await fs.promises.rename(fromFullPath, toFullPath);
  }
}
