import { RootState } from "@renderer/store";
import { FileExplorerItem } from "@renderer/utilities/FileExplorerItem";
import { AssertionError } from "@renderer/utilities/assertion";
import { selectActiveColumnIndex, selectPreviewColumnIndex } from "./selectColumnIndex";

export function selectColumn(state: RootState, columnIndex: number): FileExplorerItem[] {
  const column = state.fileExplorerItems.columns.at(columnIndex);

  if (column === undefined) {
    throw new AssertionError();
  }

  return column;
}

export function selectPreviewColumn(state: RootState): FileExplorerItem[] {
  const previewColumnIndex = selectPreviewColumnIndex(state);
  return selectColumn(state, previewColumnIndex);
}

export function selectActiveColumn(state: RootState): FileExplorerItem[] {
  const activeColumnIndex = selectActiveColumnIndex(state);
  return selectColumn(state, activeColumnIndex);
}
