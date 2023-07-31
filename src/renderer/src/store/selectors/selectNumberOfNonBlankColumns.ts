import { isFirstFileExplorerItemInColumnEqualTo } from "@renderer/utilities/isFirstFileExplorerItemInColumnEqualTo";
import { RootState } from "..";
import { SPECIAL_FILE_EXPLORER_ITEM_BLANK } from "@renderer/utilities/common";

export function selectNumberOfNonBlankColumns(state: RootState): number {
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
