import { AnyAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import { apiRunQuickLook } from "@renderer/utilities/api";
import { getActiveFileExplorerItem } from "@renderer/utilities/getActiveFileExplorerItem";
import { RootState } from "../store";

const initialState = {
  isOpen: false
};

export const quickLookSlice = createSlice({
  name: "quickLook",
  initialState,
  reducers: {
    _toggleIsOpen: (state) => {
      state.isOpen = !state.isOpen;
      return state;
    }
  }
});

export const { _toggleIsOpen } = quickLookSlice.actions;

export function openOrCloseQuickLook(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();
    const activeFileExplorerItem = getActiveFileExplorerItem(state);
    const currentFullPath = activeFileExplorerItem.fullPath;
    dispatch(_toggleIsOpen());
    apiRunQuickLook(currentFullPath);
  };
}

export function updateQuickLookIfNeeded(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();

    if (state.quickLook.isOpen) {
      const activeFileExplorerItem = getActiveFileExplorerItem(state);
      const currentFullPath = activeFileExplorerItem.fullPath;
      apiRunQuickLook(currentFullPath);
    }
  };
}

export default quickLookSlice.reducer;
