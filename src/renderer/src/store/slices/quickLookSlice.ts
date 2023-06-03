import { AnyAction, PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import { apiRunQuickLook } from "@renderer/utilities/api";
import { AssertionError, assertTrue } from "@renderer/utilities/assertion";
import {
  getActiveFileExplorerItem,
  getActiveFileExplorerItemIfAny
} from "@renderer/utilities/getActiveFileExplorerItem";
import { RootState } from "../store";

export interface QuickLookState {
  isOpen: boolean;
  fullPath: string;
}

const initialState: QuickLookState = {
  isOpen: false,
  fullPath: ""
};

export const quickLookSlice = createSlice({
  name: "quickLook",
  initialState,
  reducers: {
    _setIsOpenTrue: (state) => {
      state.isOpen = true;
      return state;
    },
    _setIsOpenFalse: (state) => {
      state.isOpen = false;
      return state;
    },
    _setFullPath: (state, action: PayloadAction<string>) => {
      const fullPath = action.payload;
      state.fullPath = fullPath;
      return state;
    },
    _resetFullPath: (state) => {
      state.fullPath = "";
      return state;
    }
  }
});

const { _setIsOpenTrue, _setIsOpenFalse, _setFullPath, _resetFullPath } = quickLookSlice.actions;

function _openQuickLook(fullPath: string): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();

    assertTrue(() => state.quickLook.isOpen === false);

    dispatch(_setIsOpenTrue());
    dispatch(_setFullPath(fullPath));
    apiRunQuickLook(fullPath);
  };
}

function _closeQuickLookUsing(
  fullPathType: "currentFullPath" | "oldFullPath"
): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();

    assertTrue(() => state.quickLook.isOpen === true);

    dispatch(_setIsOpenFalse());
    dispatch(_resetFullPath());

    if (fullPathType === "currentFullPath") {
      const activeFileExplorerItem = getActiveFileExplorerItem(state);
      const fullPath = activeFileExplorerItem.fullPath;
      apiRunQuickLook(fullPath);
    } else if (fullPathType === "oldFullPath") {
      const oldFullPath = state.quickLook.fullPath;
      apiRunQuickLook(oldFullPath);
    } else {
      throw new AssertionError();
    }
  };
}

export function toggleQuickLook(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();

    if (state.quickLook.isOpen) {
      dispatch(_closeQuickLookUsing("currentFullPath"));
      return;
    }

    const activeFileExplorerItem = getActiveFileExplorerItemIfAny(state);

    if (activeFileExplorerItem === null) {
      return;
    }

    const fullPath = activeFileExplorerItem.fullPath;
    dispatch(_openQuickLook(fullPath));
  };
}

export function updateQuickLookIfNeeded(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();

    if (state.quickLook.isOpen) {
      const activeFileExplorerItem = getActiveFileExplorerItemIfAny(state);

      if (activeFileExplorerItem === null) {
        dispatch(_closeQuickLookUsing("oldFullPath"));
        return;
      }

      const fullPath = activeFileExplorerItem.fullPath;
      dispatch(_setFullPath(fullPath));
      apiRunQuickLook(fullPath);
    }
  };
}

export function closeQuickLookUsingIfNeeded(
  fullPathType: "currentFullPath" | "oldFullPath"
): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();

    if (state.quickLook.isOpen) {
      dispatch(_closeQuickLookUsing(fullPathType));
    }
  };
}

export default quickLookSlice.reducer;
