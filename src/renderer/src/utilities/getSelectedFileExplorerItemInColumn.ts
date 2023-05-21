import { RootState } from "@renderer/store";
import { FileExplorerItem } from "./FileExplorerItem";
import { getFileExplorerItem } from "./getFileExplorerItem";
import { getRowIndex, getRowIndexElseNegativeOne } from "./getRowIndex";

export function getSelectedFileExplorerItemInColumn(
  state: RootState,
  columnIndex: number
): FileExplorerItem {
  const rowIndex = getRowIndex(state, columnIndex);
  return getFileExplorerItem(state, columnIndex, rowIndex);
}

export function getSelectedFileExplorerItemInColumnElseNull(
  state: RootState,
  columnIndex: number
): FileExplorerItem | null {
  const rowIndex = getRowIndexElseNegativeOne(state, columnIndex);

  if (rowIndex === -1) {
    return null;
  }

  return getFileExplorerItem(state, columnIndex, rowIndex);
}
