import fswin from "fswin";
import { assertIsValidFullPath } from "./assertIsValidFullPath";

export function apiQuitApp(): void {
  window.api.send("QUIT", null);
}

export function apiOpenFileExplorer(folderPath: string): void {
  assertIsValidFullPath(folderPath);
  window.api.send("OPEN_FILE_EXPLORER", folderPath);
}

export function apiRunQuickLook(fullPath: string): void {
  assertIsValidFullPath(fullPath);
  window.api.send("RUN_QUICK_LOOK", fullPath);
}

export async function apiGetStartingDirectory(): Promise<string> {
  return await window.api.invoke("GET_STARTING_DIRECTORY", null);
}

export async function apiGetFsWinDirectoryContents(folderPath: string): Promise<fswin.Find.File[]> {
  assertIsValidFullPath(folderPath);
  return await window.api.invoke("GET_FS_WIN_DIRECTORY_CONTENTS", folderPath);
}

export async function apiGetListOfDrives(): Promise<fswin.LogicalDriveList> {
  return await window.api.invoke("GET_LIST_OF_DRIVES", null);
}

export async function apiCreateNewFolder(folderPath: string): Promise<void> {
  assertIsValidFullPath(folderPath);
  await window.api.invoke("CREATE_NEW_FOLDER", folderPath);
}
