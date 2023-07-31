import { RootState } from "@renderer/store";
import { selectActiveColumnIndex } from "./selectColumnIndex";
import { selectRowIndex } from "./selectRowIndex";

export function selectActiveColumnIndexAndActiveRowIndex(state: RootState): [number, number] {
  const activeColumnIndex = selectActiveColumnIndex(state);
  const activeRowIndex = selectRowIndex(state, activeColumnIndex);

  return [activeColumnIndex, activeRowIndex];
}
