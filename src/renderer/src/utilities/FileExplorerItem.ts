import type fswin from "fswin";
import { filesize } from "filesize";

export interface FileExplorerItem {
  displayName: string;
  fullPath: string;
  isHidden: boolean;

  type: "drive" | "folder" | "file";
  Size: string;
  Created: string;
  Modified: string;
  "Last opened": string;
}

export function createFileExplorerDriveItem(
  displayName: string,
  fullPath: string
): FileExplorerItem {
  return {
    displayName: displayName,
    fullPath: fullPath,
    isHidden: false,

    type: "drive",
    Size: "",
    Created: "",
    Modified: "",
    "Last opened": ""
  };
}

export function createFileExplorerFolderItem(
  fsWinFile: fswin.Find.File,
  fullPath: string
): FileExplorerItem {
  return {
    displayName: fsWinFile.LONG_NAME,
    fullPath: fullPath,
    isHidden: fsWinFile.IS_HIDDEN,

    type: "folder",
    Size: "",
    Created: "",
    Modified: "",
    "Last opened": ""
  };
}

export function createFileExplorerFileItem(
  fsWinFile: fswin.Find.File,
  fullPath: string
): FileExplorerItem {
  return {
    displayName: fsWinFile.LONG_NAME,
    fullPath: fullPath,
    isHidden: fsWinFile.IS_HIDDEN,

    type: "file",
    Size: formatSize(fsWinFile.SIZE),
    Created: formatDate(fsWinFile.CREATION_TIME),
    Modified: formatDate(fsWinFile.LAST_WRITE_TIME),
    "Last opened": formatDate(fsWinFile.LAST_ACCESS_TIME)
  };
}

export function createFileExplorerFileOrFolderItem(
  fsWinFile: fswin.Find.File,
  fullPath: string
): FileExplorerItem {
  if (fsWinFile.IS_DIRECTORY) {
    return createFileExplorerFolderItem(fsWinFile, fullPath);
  } else {
    return createFileExplorerFileItem(fsWinFile, fullPath);
  }
}

function formatSize(numberOfBytes: number): string {
  return filesize(numberOfBytes, { base: 2 }) as string;
}

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() is 0-indexed
  const year = date.getFullYear();

  // see https://stackoverflow.com/a/55823036 for the differences between "h11", "h12", "h23" and "h24"
  const h23 = date.getHours();
  const h11 = h23 % 12;
  const h12 = h11 === 0 ? 12 : h11;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = h23 <= 11 ? "AM" : "PM";

  return `${day}/${month}/${year}, ${h12}:${minutes} ${ampm}`;
}
