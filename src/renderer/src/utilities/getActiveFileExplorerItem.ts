import { RootState } from "@renderer/store";
import { FileExplorerItem } from "./FileExplorerItem";
import { getColumnIndexAndRowIndexOfActiveFileExplorerItem } from "./getColumnIndexAndRowIndexOfActiveFileExplorerItem";
import { getFileExplorerItem } from "./getFileExplorerItem";

export function getActiveFileExplorerItem(state: RootState): FileExplorerItem {
  const [columnIndex, rowIndex] = getColumnIndexAndRowIndexOfActiveFileExplorerItem(state);
  return getFileExplorerItem(state, columnIndex, rowIndex);
}
