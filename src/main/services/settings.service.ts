import fs from "fs";
import path from "path";
import { KeyError } from "../exceptions/exceptions";

class SettingsService {
  private static filepath = path.win32.join(__filename, "../settings.json");

  private data: Record<string, any>;

  private timeout: NodeJS.Timeout | null = null;

  private isSaving = false;

  private isFlushPending = false;

  constructor() {
    try {
      const rawJsonString = fs.readFileSync(SettingsService.filepath, {
        encoding: "utf-8",
        flag: "r+" // Open file for reading and writing. An exception occurs if the file does not exist.
      });

      const jsonObject = JSON.parse(rawJsonString);
      this.data = jsonObject;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        // "settings.json" does not exist
        this.data = {};
        return;
      }

      if (error instanceof SyntaxError) {
        // JSON parse error
        this.data = {};
        return;
      }

      throw error;
    }
  }

  get(key: string) {
    if (Object.hasOwn(this.data, key)) {
      return this.data[key];
    }

    throw new KeyError(`The key '${key}' does not exist in settings.json`);
  }

  set(key: string, value: any) {
    this.data[key] = value;
    this._scheduleSaveToDisk();
  }

  private _scheduleSaveToDisk() {
    if (this.isSaving) {
      this.isFlushPending = true;
      return;
    }

    if (this.timeout === null) {
      this.timeout = setTimeout(() => {
        this._saveToDisk();
      }, 1000);
    }
  }

  private async _saveToDisk() {
    this.timeout = null;

    this.isSaving = true;
    this.isFlushPending = false;

    try {
      const jsonString = JSON.stringify(this.data, null, 2);
      await fs.promises.writeFile(SettingsService.filepath, jsonString);
    } catch (error) {
      console.error("Failed to save settings to disk:", error);
    } finally {
      this.isSaving = false;

      if (this.isFlushPending) {
        // `this.data` was updated during the write file operation
        this._scheduleSaveToDisk();
      }
    }
  }
}

const SettingsServiceSingleton = new SettingsService();

export default SettingsServiceSingleton;
