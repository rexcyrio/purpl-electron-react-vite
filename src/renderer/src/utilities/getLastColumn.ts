import { RootState } from "@renderer/store";
import { FileExplorerItem } from "./FileExplorerItem";
import { getColumn } from "./getColumn";
import { getLastColumnIndex } from "./getLastColumnIndex";

export function getLastColumn(state: RootState): FileExplorerItem[] {
  const columnIndex = getLastColumnIndex(state);
  return getColumn(state, columnIndex);
}
