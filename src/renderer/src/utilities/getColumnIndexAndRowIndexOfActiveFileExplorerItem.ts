import { RootState } from "@renderer/store";
import { getRowIndex } from "./getRowIndex";

export function getColumnIndexAndRowIndexOfActiveFileExplorerItem(
  state: RootState
): [number, number] {
  const columnIndex = state.fileExplorerItems.indices.length - 1;
  const rowIndex = getRowIndex(state, columnIndex);
  return [columnIndex, rowIndex];
}
