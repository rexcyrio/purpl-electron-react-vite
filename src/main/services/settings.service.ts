import path from "path";
import fs from "fs";
import { KeyError } from "../exceptions/exceptions";

class SettingsService {
  private static filepath = path.win32.join(__filename, "../settings.json");

  private data: Record<string, any>;

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
  }
}

const SettingsServiceSingleton = new SettingsService();

export default SettingsServiceSingleton;
