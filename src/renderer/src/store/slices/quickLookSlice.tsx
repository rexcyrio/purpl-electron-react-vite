import { createSlice } from "@reduxjs/toolkit";
import { getFullPath, getPathSegments_activeItem } from "../helper/itemsSliceHelper";

const initialState = {
  isOpen: false
};

export const quickLookSlice = createSlice({
  name: "quickLook",
  initialState,
  reducers: {
    _setIsQuickLookOpen: (state, action) => {
      state.isOpen = action.payload;
      return state;
    },
    _toggleIsQuickLookOpen: (state, action) => {
      state.isOpen = !state.isOpen;
      return state;
    }
  }
});

const { _setIsQuickLookOpen, _toggleIsQuickLookOpen } = quickLookSlice.actions;

export function openQuickLook() {
  return async function thunk(dispatch, getState) {
    dispatch(_setIsQuickLookOpen(true));
    dispatch(runQuickLook());
  };
}

export function closeQuickLook() {
  return async function thunk(dispatch, getState) {
    dispatch(_setIsQuickLookOpen(false));
    dispatch(runQuickLook());
  };
}

export function toggleQuickLook() {
  return async function thunk(dispatch, getState) {
    dispatch(_toggleIsQuickLookOpen());
    dispatch(runQuickLook());
  };
}

export function updateQuickLookIfNeeded() {
  return async function thunk(dispatch, getState) {
    const state = getState();

    if (state.quickLook.isOpen) {
      dispatch(runQuickLook());
    }
  };
}

export function runQuickLook() {
  return async function thunk(dispatch, getState) {
    const state = getState();

    const pathSegments = getPathSegments_activeItem(state);
    const fullPath = getFullPath(pathSegments);
    window.api.send("RUN_QUICK_LOOK", fullPath);
  };
}

export default quickLookSlice.reducer;
