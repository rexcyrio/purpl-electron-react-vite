import { AnyAction, PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import {
  FileExplorerItem,
  createFileExplorerDriveItem,
  createFileExplorerFileOrFolderItem
} from "@renderer/utilities/FileExplorerItem";
import {
  apiCreateNewFolder,
  apiGetFsWinDirectoryContents,
  apiGetStartingDirectory
} from "@renderer/utilities/api";
import { AssertionError, assertTrue } from "@renderer/utilities/assertion";
import {
  SPECIAL_FILE_EXPLORER_ITEM_BLANK,
  SPECIAL_FILE_EXPLORER_ITEM_FILE_DETAILS,
  SPECIAL_FILE_EXPLORER_ITEM_LOADING,
  WINDOWS_PATH_SEPARATOR
} from "@renderer/utilities/common";
import { getActiveFileExplorerItem } from "@renderer/utilities/getActiveFileExplorerItem";
import { getArrayIndexOfFirstDifferentElement } from "@renderer/utilities/getArrayIndexOfFirstDifferentElement";
import { getColumn } from "@renderer/utilities/getColumn";
import { getColumnIndexAndRowIndexOfActiveFileExplorerItem } from "@renderer/utilities/getColumnIndexAndRowIndexOfActiveFileExplorerItem";
import { getDisplayName } from "@renderer/utilities/getDisplayName";
import { getIncrementalFullPaths } from "@renderer/utilities/getIncrementalFullPaths";
import { getLastColumn } from "@renderer/utilities/getLastColumn";
import { getLastColumnIndex } from "@renderer/utilities/getLastColumnIndex";
import { getListOfDrives } from "@renderer/utilities/getListOfDrives";
import { getPathComponents } from "@renderer/utilities/getPathComponents";
import { isFirstFileExplorerItemInColumnEqualTo } from "@renderer/utilities/isFirstFileExplorerItemInColumnEqualTo";
import { removeTrailingPathSeparatorIfNeeded } from "@renderer/utilities/removeTrailingPathSeparatorIfNeeded";
import { replaceBasename } from "@renderer/utilities/replaceBasename";
import { sleep } from "@renderer/utilities/sleep";
import { sortColumnByFolderFirst } from "@renderer/utilities/sortColumnByFolderFirst";
import { RootState } from "../store";
import { setIsReady } from "./isReadySlice";

export interface FileExplorerItemsState {
  columns: FileExplorerItem[][];
  indices: number[];
}

const initialState: FileExplorerItemsState = {
  columns: [],
  indices: []
};

export const fileExplorerItemsSlice = createSlice({
  name: "fileExplorerItems",
  initialState,
  reducers: {
    _addIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.indices.push(index);
      return state;
    },
    _removeLastIndex: (state) => {
      state.indices.pop();
      return state;
    },
    _incrementLastIndex: (state) => {
      state.indices[state.indices.length - 1] += 1;
      return state;
    },
    _decrementLastIndex: (state) => {
      state.indices[state.indices.length - 1] -= 1;
      return state;
    },
    _updateLastIndex: (state, action: PayloadAction<number>) => {
      const newLastIndex = action.payload;
      state.indices[state.indices.length - 1] = newLastIndex;
      return state;
    },
    _removeIndicesToTheRightOf: (state, action: PayloadAction<number>) => {
      const columnIndex = action.payload;
      state.indices = state.indices.slice(0, columnIndex + 1);
      return state;
    },
    _addColumn: (state, action: PayloadAction<FileExplorerItem[]>) => {
      const column = action.payload;
      state.columns.push(column);
      return state;
    },
    _removeLastColumn: (state) => {
      state.columns.pop();
      return state;
    },
    _updateLastColumn: (state, action: PayloadAction<FileExplorerItem[]>) => {
      const newLastColumn = action.payload;
      state.columns[state.columns.length - 1] = newLastColumn;
      return state;
    },
    _updatePreviewColumn: (state, action: PayloadAction<FileExplorerItem[]>) => {
      const newPreviewColumn = action.payload;
      state.columns[state.indices.length] = newPreviewColumn;
      return state;
    },
    _removeColumnsToTheRightOf: (state, action: PayloadAction<number>) => {
      const columnIndex = action.payload;
      state.columns = state.columns.slice(0, columnIndex + 1);
      return state;
    }
  }
});

const {
  _addIndex,
  _removeLastIndex,
  _incrementLastIndex,
  _decrementLastIndex,
  _updateLastIndex,
  _removeIndicesToTheRightOf,
  _addColumn,
  _removeLastColumn,
  _updateLastColumn,
  _updatePreviewColumn,
  _removeColumnsToTheRightOf
} = fileExplorerItemsSlice.actions;

export function initReduxStore(): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    // adding drives
    const drives = await getListOfDrives();
    const driveLetters = Object.keys(drives).sort();
    const drivesColumn: FileExplorerItem[] = [];

    for (const driveLetter of driveLetters) {
      const displayName = driveLetter + ":";
      const fullPath = displayName + WINDOWS_PATH_SEPARATOR;
      const fileExplorerItem = createFileExplorerDriveItem(displayName, fullPath);
      drivesColumn.push(fileExplorerItem);
    }

    dispatch(_addColumn(drivesColumn));

    // populating file explorer
    const startingDirectory = await apiGetStartingDirectory();
    const incrementalFullPaths = getIncrementalFullPaths(startingDirectory);

    // adding column
    for (const folderPath of incrementalFullPaths) {
      const column = await dispatch(createColumn(folderPath));
      dispatch(_addColumn(column));
    }

    // adding index
    const columns = getState().fileExplorerItems.columns;

    for (let i = 0; i < incrementalFullPaths.length; i++) {
      const folderPath = incrementalFullPaths[i];
      const column = columns[i];

      const selectedItemDisplayName = getDisplayName(folderPath);
      const index = ((): number => {
        for (let j = 0; j < column.length; j++) {
          const fileExplorerItem = column[j];

          if (fileExplorerItem.displayName === selectedItemDisplayName) {
            return j;
          }
        }

        return -1;
      })();

      assertTrue(() => index > -1);

      dispatch(_addIndex(index));
    }

    dispatch(setIsReady(true));
  };
}

export function upArrow(): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    const state = getState();
    const [columnIndex, rowIndex] = getColumnIndexAndRowIndexOfActiveFileExplorerItem(state);

    if (rowIndex === 0) {
      return;
    }

    dispatch(_decrementLastIndex());
    dispatch(updatePreviewColumn());
  };
}

export function downArrow(): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    const state = getState();
    const [columnIndex, rowIndex] = getColumnIndexAndRowIndexOfActiveFileExplorerItem(state);
    const column = getColumn(state, columnIndex);

    if (rowIndex === column.length - 1) {
      return;
    }

    dispatch(_incrementLastIndex());
    dispatch(updatePreviewColumn());
  };
}

export function leftArrow(): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    dispatch(_removeLastIndex());
    dispatch(_removeLastColumn());
  };
}

export function rightArrow(): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    const state = getState();
    const lastColumnIndex = getLastColumnIndex(state);

    const isNextColumnBlank = isFirstFileExplorerItemInColumnEqualTo(
      state,
      lastColumnIndex,
      SPECIAL_FILE_EXPLORER_ITEM_BLANK
    );

    const isNextColumnLoading = isFirstFileExplorerItemInColumnEqualTo(
      state,
      lastColumnIndex,
      SPECIAL_FILE_EXPLORER_ITEM_LOADING
    );

    const isNextColumnFileDetails = isFirstFileExplorerItemInColumnEqualTo(
      state,
      lastColumnIndex,
      SPECIAL_FILE_EXPLORER_ITEM_FILE_DETAILS
    );

    if (isNextColumnBlank || isNextColumnLoading || isNextColumnFileDetails) {
      return;
    }

    dispatch(_addIndex(0));
    dispatch(addPreviewColumn());
  };
}

export function createColumn(
  fullPath: string
): ThunkAction<Promise<FileExplorerItem[]>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<FileExplorerItem[]> {
    const fsWinDirectoryContents = await apiGetFsWinDirectoryContents(fullPath);
    const column: FileExplorerItem[] = [];

    for (const fsWinFile of fsWinDirectoryContents) {
      const _fullPath =
        removeTrailingPathSeparatorIfNeeded(fullPath) +
        WINDOWS_PATH_SEPARATOR +
        fsWinFile.LONG_NAME;

      const fileExplorerItem = createFileExplorerFileOrFolderItem(fsWinFile, _fullPath);
      column.push(fileExplorerItem);
    }

    await sleep(1000);

    const sortedColumn = sortColumnByFolderFirst(column);
    return sortedColumn;
  };
}

export function createPreviewColumn(): ThunkAction<
  Promise<FileExplorerItem[]>,
  RootState,
  unknown,
  AnyAction
> {
  return async function thunk(dispatch, getState): Promise<FileExplorerItem[]> {
    const state = getState();
    const activeFileExplorerItem = getActiveFileExplorerItem(state);

    if (activeFileExplorerItem.type === "file") {
      return [SPECIAL_FILE_EXPLORER_ITEM_FILE_DETAILS];
    }

    // `activeFileExplorerItem` is either a drive or a folder
    const fullPath = activeFileExplorerItem.fullPath;
    const column = await dispatch(createColumn(fullPath));
    return column;
  };
}

export function createLoadingColumn(): ThunkAction<
  FileExplorerItem[],
  RootState,
  unknown,
  AnyAction
> {
  return function thunk(dispatch, getState): FileExplorerItem[] {
    return [SPECIAL_FILE_EXPLORER_ITEM_LOADING];
  };
}

export function addPreviewColumn(): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    const loadingColumn = dispatch(createLoadingColumn());
    dispatch(_addColumn(loadingColumn));

    const newPreviewColumn = await dispatch(createPreviewColumn());

    // check that the column we are replacing is *actually* the old `loadingColumn`
    const state = getState();
    const columnIndexOfPreviewColumn = state.fileExplorerItems.indices.length;
    const columnToBeUpdated = getColumn(state, columnIndexOfPreviewColumn);

    if (columnToBeUpdated === loadingColumn) {
      dispatch(_updatePreviewColumn(newPreviewColumn));
    } else {
      console.log("good catch!");
    }
  };
}

export function updatePreviewColumn(): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    const loadingColumn = dispatch(createLoadingColumn());
    dispatch(_updatePreviewColumn(loadingColumn));

    const newPreviewColumn = await dispatch(createPreviewColumn());

    // check that the column we are replacing is *actually* the old `loadingColumn`
    const state = getState();
    const columnIndexOfPreviewColumn = state.fileExplorerItems.indices.length;
    const columnToBeUpdated = getColumn(state, columnIndexOfPreviewColumn);

    if (columnToBeUpdated === loadingColumn) {
      dispatch(_updatePreviewColumn(newPreviewColumn));
    } else {
      console.log("good catch!");
    }
  };
}

export function navigateTo(
  columnIndex: number,
  rowIndex: number
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    const state = getState();
    const [activeColumnIndex, activeRowIndex] =
      getColumnIndexAndRowIndexOfActiveFileExplorerItem(state);

    assertTrue(() => {
      const numColumns = state.fileExplorerItems.columns.length;
      return columnIndex >= 0 && columnIndex <= numColumns - 1;
    });

    if (columnIndex < activeColumnIndex) {
      const selectedRowIndex = state.fileExplorerItems.indices[columnIndex];

      if (selectedRowIndex === rowIndex) {
        // user clicked on an already selected parent item
        // => make it the active item
        dispatch(_removeIndicesToTheRightOf(columnIndex));
        dispatch(_removeColumnsToTheRightOf(columnIndex + 1));
      } else {
        dispatch(_removeIndicesToTheRightOf(columnIndex));
        dispatch(_removeColumnsToTheRightOf(columnIndex));
        dispatch(_updateLastIndex(rowIndex));
        dispatch(updatePreviewColumn());
      }
    } else if (columnIndex === activeColumnIndex) {
      if (rowIndex === activeRowIndex) {
        // user clicked on the currently active item
        // do nothing
      } else {
        dispatch(_updateLastIndex(rowIndex));
        dispatch(updatePreviewColumn());
      }
    } else if (columnIndex === activeColumnIndex + 1) {
      dispatch(_addIndex(rowIndex));
      dispatch(addPreviewColumn());
    } else {
      throw new AssertionError();
    }
  };
}

export function navigateToFullPath(
  fullPath: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    const targetPathComponents = getPathComponents(fullPath);

    const state = getState();
    const activeFileExplorerItem = getActiveFileExplorerItem(state);
    const currentPathComponents = getPathComponents(activeFileExplorerItem.fullPath);

    const indexOfFirstDifferentPathComponent = getArrayIndexOfFirstDifferentElement(
      targetPathComponents,
      currentPathComponents
    );

    if (indexOfFirstDifferentPathComponent === -1) {
      // the two arrays are equal
      return;
    }

    dispatch(_removeIndicesToTheRightOf(indexOfFirstDifferentPathComponent - 1));
    dispatch(_removeColumnsToTheRightOf(indexOfFirstDifferentPathComponent));

    // adding the remaining columns
    const incrementalFullPaths = getIncrementalFullPaths(fullPath);

    for (let i = indexOfFirstDifferentPathComponent; i < incrementalFullPaths.length; i++) {
      const folderPath = incrementalFullPaths[i];
      const column = await dispatch(createColumn(folderPath));
      dispatch(_addColumn(column));
    }

    // adding the remaining indices
    const columns = getState().fileExplorerItems.columns;

    for (let i = indexOfFirstDifferentPathComponent; i < incrementalFullPaths.length; i++) {
      const folderPath = incrementalFullPaths[i];
      const column = columns[i];

      const selectedItemDisplayName = getDisplayName(folderPath);
      const index = ((): number => {
        for (let j = 0; j < column.length; j++) {
          const fileExplorerItem = column[j];

          if (fileExplorerItem.displayName === selectedItemDisplayName) {
            return j;
          }
        }

        return -1;
      })();

      assertTrue(() => index > -1);

      dispatch(_addIndex(index));
    }
  };
}

/**
 * Windows does not allow a file and folder to have the same name in the same
 * directory.
 */
export function isDuplicateName(
  newFolderName: string
): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<boolean> {
    const state = getState();
    const lastColumn = getLastColumn(state);

    for (const fileExplorerItem of lastColumn) {
      if (fileExplorerItem.displayName === newFolderName) {
        return false;
      }
    }

    return true;
  };
}

export function createNewFolder(
  newFolderName: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState): Promise<void> {
    const state = getState();
    const activeFileExplorerItem = getActiveFileExplorerItem(state);
    const fullPath = activeFileExplorerItem.fullPath;
    const folderPath = replaceBasename(fullPath, newFolderName);
    apiCreateNewFolder(folderPath);
  };
}

export default fileExplorerItemsSlice.reducer;