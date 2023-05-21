import { RootState } from "@renderer/store";
import { FileExplorerItem } from "./FileExplorerItem";
import { AssertionError } from "./assertion";
import { getColumn } from "./getColumn";

export function getFileExplorerItem(
  state: RootState,
  columnIndex: number,
  rowIndex: number
): FileExplorerItem {
  const column = getColumn(state, columnIndex);
  const fileExplorerItem = column.at(rowIndex);

  if (fileExplorerItem === undefined) {
    throw new AssertionError();
  }

  return fileExplorerItem;
}

export function getFileExplorerItemIfAny(
  state: RootState,
  columnIndex: number,
  rowIndex: number
): FileExplorerItem | null {
  const column = getColumn(state, columnIndex);
  const fileExplorerItem = column.at(rowIndex);

  if (fileExplorerItem === undefined) {
    return null;
  }

  return fileExplorerItem;
}
