import { RootState } from "@renderer/store";

export function selectActiveColumnIndex(state: RootState): number {
  return state.fileExplorerItems.indices.length - 1;
}

export function selectPreviewColumnIndex(state: RootState): number {
  return state.fileExplorerItems.indices.length;
}
