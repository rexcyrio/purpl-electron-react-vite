import { RootState } from "@renderer/store";
import { AssertionError } from "@renderer/utilities/assertion";
import { selectActiveColumnIndex } from "./selectColumnIndex";

export function selectActiveRowIndex(state: RootState): number {
  const activeColumnIndex = selectActiveColumnIndex(state);
  const activeRowIndex = selectRowIndex(state, activeColumnIndex);

  return activeRowIndex;
}

export function selectRowIndex(state: RootState, columnIndex: number): number {
  const rowIndex = state.fileExplorerItems.indices.at(columnIndex);

  if (rowIndex === undefined) {
    throw new AssertionError();
  }

  return rowIndex;
}

export function selectRowIndexElseNegativeOne(state: RootState, columnIndex: number): number {
  const rowIndex = state.fileExplorerItems.indices.at(columnIndex);

  if (rowIndex === undefined) {
    return -1;
  }

  return rowIndex;
}
