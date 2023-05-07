import { createSlice } from "@reduxjs/toolkit";
import { getFullPath, getPathSegments_activeItem } from "../helper/itemsSliceHelper";

const initialState = null;

export const fileStatsSlice = createSlice({
  name: "fileStats",
  initialState,
  reducers: {
    _setFileStats: (state, action) => action.payload
  }
});

const { _setFileStats } = fileStatsSlice.actions;

export function resetFileStats() {
  return async function thunk(dispatch, getState) {
    dispatch(_setFileStats(initialState));
  };
}

export function getFileStats() {
  return async function thunk(dispatch, getState) {
    const state = getState();

    const pathSegments = getPathSegments_activeItem(state);
    const fullPath = getFullPath(pathSegments);
    const stats = await window.api.invoke("GET_FILE_STATS", fullPath);

    const miniStats = {
      size: _formatSize(stats.size),
      birthtime: _formatDateObject(stats.birthtime),
      mtime: _formatDateObject(stats.mtime),
      atime: _formatDateObject(stats.atime)
    };

    dispatch(_setFileStats(miniStats));
  };
}

// ============================================================================
// helper
// ============================================================================

function _formatSize(numB) {
  const numKB = Math.ceil(numB / 1024);
  return `${numKB} KB`;
}

function _formatDateObject(dateObject) {
  const d = dateObject.getDate();
  const m = dateObject.getMonth() + 1; // return value is 0-indexed
  const yyyy = dateObject.getFullYear();

  const h24 = dateObject.getHours();
  const h12 = h24 >= 13 ? h24 - 12 : h24;
  const minutes = dateObject.getMinutes();
  const AM_PM_string = h24 <= 11 ? "AM" : "PM";

  return `${d}/${m}/${yyyy}, ${h12}:${minutes} ${AM_PM_string}`;
}

export default fileStatsSlice.reducer;
