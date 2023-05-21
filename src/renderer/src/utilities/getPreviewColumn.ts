import { RootState } from "@renderer/store";
import { FileExplorerItem } from "./FileExplorerItem";
import { getColumn } from "./getColumn";

export function getPreviewColumn(state: RootState): FileExplorerItem[] {
  const columnIndexOfPreviewColumn = state.fileExplorerItems.indices.length;
  return getColumn(state, columnIndexOfPreviewColumn);
}
