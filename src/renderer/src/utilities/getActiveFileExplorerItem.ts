import { RootState } from "@renderer/store";
import { FileExplorerItem } from "./FileExplorerItem";
import { getColumnIndexAndRowIndexOfActiveFileExplorerItem } from "./getColumnIndexAndRowIndexOfActiveFileExplorerItem";
import { getFileExplorerItem, getFileExplorerItemIfAny } from "./getFileExplorerItem";

export function getActiveFileExplorerItem(state: RootState): FileExplorerItem {
  const [columnIndex, rowIndex] = getColumnIndexAndRowIndexOfActiveFileExplorerItem(state);
  return getFileExplorerItem(state, columnIndex, rowIndex);
}

export function getActiveFileExplorerItemIfAny(state: RootState): FileExplorerItem | null {
  const [columnIndex, rowIndex] = getColumnIndexAndRowIndexOfActiveFileExplorerItem(state);
  return getFileExplorerItemIfAny(state, columnIndex, rowIndex);
}
