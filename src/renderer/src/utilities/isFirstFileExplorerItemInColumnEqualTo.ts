import { RootState } from "@renderer/store";
import { FileExplorerItem } from "./FileExplorerItem";
import { getFileExplorerItemIfAny } from "./getFileExplorerItem";

export function isFirstFileExplorerItemInColumnEqualTo(
  state: RootState,
  columnIndex: number,
  SPECIAL_ITEM: FileExplorerItem
): boolean {
  const fileExplorerItem = getFileExplorerItemIfAny(state, columnIndex, 0);
  return fileExplorerItem === SPECIAL_ITEM;
}
