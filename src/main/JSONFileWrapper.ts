import fs from "fs";

export default class JSONFileWrapper {
  private fullPath: string;
  private data: { [key: string]: any };
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

  set(key: string, value: any): void {
    this.data[key] = value;

    if (this.isWriting) {
      // do nothing (to prevent race conditions)
    } else {
      this.isWriting = true;

      fs.writeFile(
        this.fullPath,
        JSON.stringify(this.data, null, 4),
        { encoding: "utf8", flag: "w" },
        (error) => {
          if (error) {
            throw error;
          }

          console.log(`${this.fullPath} updated successfully`);
          this.isWriting = false;
        }
      );
    }
  }
}

function readJSONFile(fullPath: string): any {
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
