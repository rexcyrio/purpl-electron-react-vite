import { FileExplorerItem } from "./FileExplorerItem";
import { AssertionError, assertTrue } from "./assertion";
import { ALL_SPECIAL_FILE_EXPLORER_ITEMS } from "./common";

export function isFirstFileExplorerItemInColumnEqualTo(
  column: FileExplorerItem[],
  SPECIAL_ITEM: FileExplorerItem
): boolean {
  assertTrue(() => ALL_SPECIAL_FILE_EXPLORER_ITEMS.indexOf(SPECIAL_ITEM) > -1);

  const firstFileExplorerItem = column.at(0);

  if (firstFileExplorerItem === undefined) {
    throw new AssertionError();
  }

  return firstFileExplorerItem === SPECIAL_ITEM;
}
