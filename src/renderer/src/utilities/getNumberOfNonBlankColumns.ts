import { RootState } from "@renderer/store";
import { SPECIAL_FILE_EXPLORER_ITEM_BLANK } from "./common";
import { isFirstFileExplorerItemInColumnEqualTo } from "./isFirstFileExplorerItemInColumnEqualTo";

export function getNumberOfNonBlankColumns(state: RootState): number {
  const columns = state.fileExplorerItems.columns;

  const nonBlankColumns = columns.filter((column) => {
    if (column.length === 0) {
      return true;
    }

    if (isFirstFileExplorerItemInColumnEqualTo(column, SPECIAL_FILE_EXPLORER_ITEM_BLANK)) {
      return false;
    }

    return true;
  });

  return nonBlankColumns.length;
}
