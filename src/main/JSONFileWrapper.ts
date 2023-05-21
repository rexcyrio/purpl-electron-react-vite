import fs from "fs";

interface JSONObject {
  [key: string]: any;
}

export class JSONFileWrapper {
  private fullPath: string;
  private data: JSONObject;
  private isWriting: boolean;

  constructor(fullPath: string) {
    this.fullPath = fullPath;
    this.data = readJSONFile(fullPath);
    this.isWriting = false;
  }

  exists(key: string): boolean {
    return key in this.data;
  }

  get(key: string): any {
    return this.data[key];
  }

  async set(key: string, value: any): Promise<void> {
    this.data[key] = value;

    if (this.isWriting) {
      // do nothing to prevent race conditions
      return;
    }

    this.isWriting = true;

    await fs.promises.writeFile(this.fullPath, JSON.stringify(this.data, null, 4), {
      encoding: "utf8",
      flag: "w"
    });

    console.log(`${this.fullPath} updated successfully`);
    this.isWriting = false;
  }
}

function readJSONFile(fullPath: string): JSONObject {
  try {
    const data = fs.readFileSync(fullPath, {
      encoding: "utf-8",
      flag: "r"
    });
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // file does not exist
      return {};
    } else {
      throw error;
    }
  }
}
