import fs from "fs";

export async function doesFileExist(fullPath: string): Promise<boolean> {
  try {
    await fs.promises.access(fullPath, fs.constants.F_OK);
    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return false;
    } else {
      throw error;
    }
  }
}
