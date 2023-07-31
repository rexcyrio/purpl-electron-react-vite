import { RootState } from "@renderer/store";
import { FileExplorerItem } from "@renderer/utilities/FileExplorerItem";
import { AssertionError } from "@renderer/utilities/assertion";
import { selectColumn } from "./selectColumn";
import { selectRowIndex, selectRowIndexElseNegativeOne } from "./selectRowIndex";
import { selectActiveColumnIndexAndActiveRowIndex } from "./selectActiveColumnIndexAndActiveRowIndex";

export function selectFileExplorerItem(
  state: RootState,
  columnIndex: number,
  rowIndex: number
): FileExplorerItem {
  const column = selectColumn(state, columnIndex);
  const fileExplorerItem = column.at(rowIndex);

  if (fileExplorerItem === undefined) {
    throw new AssertionError();
  }

  return fileExplorerItem;
}

export function selectFileExplorerItemIfAny(
  state: RootState,
  columnIndex: number,
  rowIndex: number
): FileExplorerItem | null {
  const column = selectColumn(state, columnIndex);
  const fileExplorerItem = column.at(rowIndex);

  if (fileExplorerItem === undefined) {
    return null;
  }

  return fileExplorerItem;
}

export function selectActiveFileExplorerItem(state: RootState): FileExplorerItem {
  const [columnIndex, rowIndex] = selectActiveColumnIndexAndActiveRowIndex(state);
  return selectFileExplorerItem(state, columnIndex, rowIndex);
}

export function selectActiveFileExplorerItemIfAny(state: RootState): FileExplorerItem | null {
  const [columnIndex, rowIndex] = selectActiveColumnIndexAndActiveRowIndex(state);
  return selectFileExplorerItemIfAny(state, columnIndex, rowIndex);
}

export function selectSelectedFileExplorerItemInColumn(
  state: RootState,
  columnIndex: number
): FileExplorerItem {
  const rowIndex = selectRowIndex(state, columnIndex);
  const fileExplorerItem = selectFileExplorerItem(state, columnIndex, rowIndex);
  return fileExplorerItem;
}

export function selectSelectedFileExplorerItemInColumnIfAny(
  state: RootState,
  columnIndex: number
): FileExplorerItem | null {
  const rowIndex = selectRowIndexElseNegativeOne(state, columnIndex);

  if (rowIndex === -1) {
    return null;
  }

  const fileExplorerItem = selectFileExplorerItem(state, columnIndex, rowIndex);
  return fileExplorerItem;
}
