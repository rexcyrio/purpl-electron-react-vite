import { RootState } from "@renderer/store";
import { FileExplorerItem } from "./FileExplorerItem";
import { AssertionError } from "./assertion";

export function getColumn(state: RootState, columnIndex: number): FileExplorerItem[] {
  const column = state.fileExplorerItems.columns.at(columnIndex);

  if (column === undefined) {
    throw new AssertionError();
  }

  return column;
}
