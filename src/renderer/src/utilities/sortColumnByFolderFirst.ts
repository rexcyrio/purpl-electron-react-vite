import { FileExplorerItem } from "./FileExplorerItem";

/**
 * Returns a new sorted column.
 */
export function sortColumnByFolderFirst(column: FileExplorerItem[]): FileExplorerItem[] {
  const folders: FileExplorerItem[] = [];
  const files: FileExplorerItem[] = [];

  for (const fileExplorerItem of column) {
    if (fileExplorerItem.type === "folder") {
      folders.push(fileExplorerItem);
    } else {
      files.push(fileExplorerItem);
    }
  }

  return [...folders, ...files];
}
