import { RootState } from "@renderer/store";
import { assertTrue } from "./assertion";

export function getLastColumnIndex(state: RootState): number {
  const _length = state.fileExplorerItems.columns.length;
  assertTrue(() => _length > 0);
  return _length - 1;
}
