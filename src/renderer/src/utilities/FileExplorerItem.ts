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
  const d = date.getDate();
  const m = date.getMonth() + 1; // return value is 0-indexed
  const yyyy = date.getFullYear();

  const h24 = date.getHours();
  const h12 = h24 >= 13 ? h24 - 12 : h24;
  const minutes = date.getMinutes();
  const AM_PM_string = h24 <= 11 ? "AM" : "PM";

  return `${d}/${m}/${yyyy}, ${h12}:${minutes} ${AM_PM_string}`;
}
