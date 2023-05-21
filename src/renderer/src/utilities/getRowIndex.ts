import { RootState } from "@renderer/store";
import { AssertionError } from "./assertion";

export function getRowIndex(state: RootState, columnIndex: number): number {
  const rowIndex = state.fileExplorerItems.indices.at(columnIndex);

  if (rowIndex === undefined) {
    throw new AssertionError();
  }

  return rowIndex;
}

export function getRowIndexElseNegativeOne(state: RootState, columnIndex: number): number {
  const rowIndex = state.fileExplorerItems.indices.at(columnIndex);

  if (rowIndex === undefined) {
    return -1;
  }

  return rowIndex;
}
