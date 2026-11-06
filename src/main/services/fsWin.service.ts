import fswin from "fswin";
import path from "path";

export default class FsWinService {
  async getListOfDrives() {
    return await fswin.getLogicalDriveListAsync();
  }

  async getDirectoryContents(folderPath: string) {
    const folderPathWithTrailingWildcard = path.win32.join(folderPath, "*");

    return await fswin.findAsync(folderPathWithTrailingWildcard);
  }
}
