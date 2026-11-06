import cmd from "child_process";
import { dialog } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import { MAIN_WINDOW } from "..";
import { PurplError } from "../exceptions/exceptions";
import SettingsServiceSingleton from "./settings.service";

const USERPROFILE = os.homedir();

export default class QuickLookService {
  private static settingsKeyName = "quickLookExePath";

  private static defaultQuickLookExePath = path.win32.join(
    USERPROFILE,
    "\\AppData\\Local\\Programs\\QuickLook\\QuickLook.exe"
  );

  async runQuickLook(fullPath: string) {
    const quickLookExePath = await this._findQuickLookExePath();
    this._runQuickLook(quickLookExePath, fullPath);
  }

  private async _findQuickLookExePath() {
    const quickLookExePath = SettingsServiceSingleton.get(QuickLookService.settingsKeyName);

    if (this._isExists(quickLookExePath)) {
      return quickLookExePath;
    }

    // check for QuickLook.exe in the default install location
    const defaultQuickLookExePath = QuickLookService.defaultQuickLookExePath;

    if (this._isExists(defaultQuickLookExePath)) {
      return defaultQuickLookExePath;
    }

    // prompt user
    await dialog.showMessageBox(MAIN_WINDOW, {
      message: "QuickLook.exe was not found at its default install location.",
      detail: "Please navigate to QuickLook.exe in the following window.",
      type: "info"
    });

    const { canceled, filePaths } = await dialog.showOpenDialog(MAIN_WINDOW, {
      defaultPath: USERPROFILE,
      filters: [
        { name: "Executable", extensions: ["exe"] },
        { name: "All Files", extensions: ["*"] }
      ],
      properties: ["openFile", "dontAddToRecent"]
    });

    if (canceled) {
      throw new PurplError("User cancelled the action.");
    }

    const userQuickLookExePath = filePaths[0];
    SettingsServiceSingleton.set(QuickLookService.settingsKeyName, userQuickLookExePath);

    return userQuickLookExePath;
  }

  private _isExists(quickLookExePath: string) {
    return fs.existsSync(quickLookExePath);
  }

  private _runQuickLook(quickLookExePath: string, fullPath: string) {
    cmd.exec(`"${quickLookExePath}" "${fullPath}"`);
  }
}
