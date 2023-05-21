import { AnyAction, createSlice, Dispatch, ThunkAction } from "@reduxjs/toolkit";
import {
  getActiveItem_columnIndex,
  getActiveItem_rowIndex,
  getAllItems,
  getFullPath,
  getItemName,
  getItems,
  getNumberOfValidColumns,
  getPathSegments_activeItem,
  getPathSegments_directoryOf,
  getPathSegments_directoryOfActiveItem,
  getPathSegments_nodejsDirname,
  getPreviewColumnItems,
  getSelectedItem,
  getSelectedItem_rowIndex,
  isColumn,
  isFolder_activeItem
} from "../helper/itemsSliceHelper";
import { SynchronisationQueue } from "../../utilities/SynchronisationQueue";
import { RootState } from "../store";
import { setIsCreateNewFolderDialogOpen } from "./isCreateNewFolderDialogOpenSlice";
import { openErrorSnackbarWithAlertText } from "./errorSnackbarSlice";
import { setIsReady } from "./isReadySlice";
import { AssertionError } from "@renderer/utilities/assertion";

const initialState: { allItems: Purpl.Item[][]; indices: number[] } = {
  allItems: [],
  indices: []
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    _setAllItems: (state, action) => {
      const newAllItems = action.payload;
      state.allItems = newAllItems;
      return state;
    },
    _setIndices: (state, action) => {
      const newIndices = action.payload;
      state.indices = newIndices;
      return state;
    },
    _upArrow: (state) => {
      state.indices[state.indices.length - 1] -= 1;
      return state;
    },
    _downArrow: (state) => {
      state.indices[state.indices.length - 1] += 1;
      return state;
    },
    _leftArrow: (state) => {
      const numValidColumns = getNumberOfValidColumns(state.allItems);

      if (numValidColumns > 2) {
        // start from the back
        for (let i = state.allItems.length - 1; i >= 0; i--) {
          if (!isColumn(state.allItems[i], SPECIAL_BLANK_STRING)) {
            state.allItems[i] = [SPECIAL_BLANK_STRING];
            break;
          }
        }

        state.indices.pop();
      }

      return state;
    },
    _rightArrow: (state) => {
      state.indices.push(0);
      return state;
    },
    _addColumn: (state, action) => {
      const items = action.payload;

      // replace blank column as needed
      if (
        state.allItems.length - 1 >= state.indices.length &&
        isColumn(state.allItems[state.indices.length], SPECIAL_BLANK_STRING)
      ) {
        state.allItems.splice(state.indices.length, 1, items);
      } else {
        state.allItems.push(items);
      }

      return state;
    },
    _replacePreviewColumn: (state, action) => {
      const items = action.payload;
      state.allItems.splice(state.indices.length, 1, items);
      return state;
    },
    _removeIndicesToTheRightOf: (state, action) => {
      const columnIndex = action.payload;
      state.indices = state.indices.slice(0, columnIndex + 1);
      return state;
    },
    _removeColumnsToTheRightOf: (state, action) => {
      const columnIndex = action.payload;
      state.allItems = state.allItems.slice(0, columnIndex + 1);
      return state;
    },
    _setColumnsToTheRightOf_columnIndex_ToBlank: (state, action) => {
      const columnIndex = action.payload;

      for (let i = columnIndex + 1; i < state.allItems.length; i++) {
        state.allItems[i] = [SPECIAL_BLANK_STRING];
      }

      return state;
    },
    _setActiveItem_rowIndex: (state, action) => {
      const activeItem_rowIndex = action.payload;
      state.indices[state.indices.length - 1] = activeItem_rowIndex;
      return state;
    },
    _addIndex: (state, action) => {
      const index = action.payload;
      state.indices.push(index);
      return state;
    },
    _popIndex: (state) => {
      state.indices.pop();
      return state;
    },
    _replaceIndex: (state, action) => {
      const { columnIndex, index } = action.payload;
      state.indices[columnIndex] = index;
      return state;
    },
    _replaceColumn: (state, action) => {
      const { columnIndex, items } = action.payload;
      state.allItems[columnIndex] = items;
      return state;
    }
  }
});

const {
  _setAllItems,
  _setIndices,
  _upArrow,
  _downArrow,
  _leftArrow,
  _rightArrow,
  _addColumn,
  _replacePreviewColumn,
  _removeIndicesToTheRightOf,
  _removeColumnsToTheRightOf,
  _setColumnsToTheRightOf_columnIndex_ToBlank,
  _setActiveItem_rowIndex,
  _addIndex,
  _popIndex,
  _replaceIndex,
  _replaceColumn
} = itemsSlice.actions;

export function initReduxStore(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const pathSegments = getPathSegments_nodejsDirname();

    const allItems = await getAllItems(pathSegments);
    dispatch(_setAllItems(allItems));

    const indices: number[] = [];

    for (let i = 0; i < pathSegments.length; i++) {
      const items = allItems[i];
      const pathSegment = pathSegments[i];

      for (let j = 0; j < items.length; j++) {
        const item = items[j];

        if (item.name === pathSegment) {
          indices.push(j);
          break;
        }
      }
    }

    dispatch(_setIndices(indices));
    dispatch(setIsReady(true));
  };
}

export function upArrow(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();
    const activeItem_rowIndex = state.items.indices.at(-1);

    if (activeItem_rowIndex === undefined) {
      throw new AssertionError();
    }

    if (activeItem_rowIndex === -1) {
      return;
    }

    if (activeItem_rowIndex > 0) {
      dispatch(_upArrow());
      dispatch(_replacePreviewColumn([SPECIAL_LOADING_STRING]));
      dispatch(refreshPreviewColumn());

      dispatch(updateQuickLookIfNeeded());
    }
  };
}

export function downArrow(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();
    const activeItem_rowIndex = state.items.indices.at(-1);
    const activeItem_columnIndex = state.items.indices.length - 1;

    if (activeItem_rowIndex === undefined) {
      throw new AssertionError();
    }

    if (activeItem_rowIndex === -1) {
      return;
    }

    const maxRowIndex = state.items.allItems[activeItem_columnIndex].length - 1;
    if (activeItem_rowIndex < maxRowIndex) {
      dispatch(_downArrow());
      dispatch(_replacePreviewColumn([SPECIAL_LOADING_STRING]));
      dispatch(refreshPreviewColumn());

      dispatch(updateQuickLookIfNeeded());
    }
  };
}

export function leftArrow(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();
    const activeItem_rowIndex = getActiveItem_rowIndex(state);

    if (activeItem_rowIndex === -1) {
      dispatch(_popIndex());
    } else {
      dispatch(_leftArrow());

      dispatch(updateQuickLookIfNeeded());
    }
  };
}

const QUEUE = new SynchronisationQueue();

export function rightArrow(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const ticket = QUEUE.generateTicket();

    QUEUE.enqueue(ticket);
    await QUEUE.waitTillMyTurn(ticket);

    const state = getState();

    const activeItem_rowIndex = getActiveItem_rowIndex(state);
    if (activeItem_rowIndex === -1) {
      QUEUE.dequeue(ticket);
      return;
    }

    const _isFolder = isFolder_activeItem(state);
    if (!_isFolder) {
      QUEUE.dequeue(ticket);
      return;
    }

    const previewColumnItems = getPreviewColumnItems(state);
    if (previewColumnItems.length === 0) {
      dispatch(_addIndex(-1));
      QUEUE.dequeue(ticket);
      return;
    }

    if (
      !isColumn(previewColumnItems, SPECIAL_FILE_STRING) &&
      !isColumn(previewColumnItems, SPECIAL_LOADING_STRING)
    ) {
      dispatch(_rightArrow());
      dispatch(_addColumn([SPECIAL_LOADING_STRING]));
      dispatch(refreshPreviewColumn());

      dispatch(updateQuickLookIfNeeded());

      QUEUE.dequeue(ticket);
      return;
    }
  };
}

export function refreshColumn(
  columnIndex: number
): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();

    const selectedItem = getSelectedItem(state, columnIndex);
    const selectedItemName = getItemName(selectedItem);

    const pathSegments = getPathSegments_directoryOf(state, columnIndex);
    const items = await getItems(pathSegments);

    const payloadColumn = {
      columnIndex,
      items
    };

    dispatch(_replaceColumn(payloadColumn));

    if (selectedItemName === undefined) {
      // user created a new folder in an empty folder
      const payloadIndex = {
        columnIndex: columnIndex,
        index: 0
      };

      dispatch(_replaceIndex(payloadIndex));
      dispatch(_addColumn([SPECIAL_LOADING_STRING]));
      dispatch(refreshPreviewColumn());
    } else {
      for (let i = 0; i < items.length; i++) {
        if (items[i].name === selectedItemName) {
          const payloadIndex = {
            columnIndex: columnIndex,
            index: i
          };

          dispatch(_replaceIndex(payloadIndex));
          break;
        }
      }
    }

    dispatch(setIsCreateNewFolderDialogOpen(false));
  };
}

export function refreshPreviewColumn(): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const pathSegments = getPathSegments_activeItem(getState());
    const items = await getItems(pathSegments);

    dispatch(_replacePreviewColumn(items));
  };
}

export function navigateTo(
  columnIndex: number,
  rowIndex: number
): ThunkAction<void, RootState, unknown, AnyAction> {
  return async function thunk(dispatch, getState) {
    const state = getState();

    const activeItem_rowIndex = getActiveItem_rowIndex(state);
    const activeItem_columnIndex = getActiveItem_columnIndex(state);

    if (columnIndex < activeItem_columnIndex) {
      const selectedItem_rowIndex = getSelectedItem_rowIndex(state, columnIndex);

      dispatch(_removeIndicesToTheRightOf(columnIndex));
      dispatch(_setColumnsToTheRightOf_columnIndex_ToBlank(columnIndex + 1));

      if (rowIndex === selectedItem_rowIndex) {
        // user clicked on an already selected item
        // do nothing
      } else {
        dispatch(_setActiveItem_rowIndex(rowIndex));
        dispatch(_replacePreviewColumn([SPECIAL_LOADING_STRING]));
        dispatch(refreshPreviewColumn());
      }

      return;
    }

    if (columnIndex === activeItem_columnIndex) {
      if (rowIndex === activeItem_rowIndex) {
        // user clicked on the currently active item
        // do nothing
      } else {
        dispatch(_setActiveItem_rowIndex(rowIndex));
        dispatch(_replacePreviewColumn([SPECIAL_LOADING_STRING]));
        dispatch(refreshPreviewColumn());
      }

      return;
    }

    if (columnIndex === activeItem_columnIndex + 1) {
      if (rowIndex === -1) {
        // user clicked on empty folder
        dispatch(_addIndex(rowIndex));
      } else {
        dispatch(_addIndex(rowIndex));
        dispatch(_addColumn([SPECIAL_LOADING_STRING]));
        dispatch(refreshPreviewColumn());
      }

      return;
    }

    throw new Error(`navigateTo :: columnIndex = ${columnIndex}`);
  };
}

export function removeColumnsToTheRightOf(columnIndex) {
  return async function thunk(dispatch: Dispatch, getState: () => RootState): Promise<void> {
    dispatch(_removeColumnsToTheRightOf(columnIndex));
  };
}

export function openFileExplorer() {
  return async function thunk(dispatch: Dispatch, getState: () => RootState): Promise<void> {
    const state = getState();

    const pathSegments = getPathSegments_directoryOfActiveItem(state);
    const folderPath = getFullPath(pathSegments);

    window.api.send("OPEN_FILE_EXPLORER", folderPath);
  };
}

export function moveItem(from_columnIndex: number, from_rowIndex: number, to_columnIndex: number) {
  return async function thunk(dispatch: Dispatch, getState: () => RootState): Promise<void> {
    const state = getState();
    const itemBeingMoved = state.items.allItems[from_columnIndex][from_rowIndex];
    const itemBeingMovedName = getItemName(itemBeingMoved);

    const from_pathSegments = getPathSegments_directoryOf(state, from_columnIndex);
    const to_pathSegments = getPathSegments_directoryOf(state, to_columnIndex);

    from_pathSegments.push(itemBeingMovedName);
    to_pathSegments.push(itemBeingMovedName);

    const from_fullPath = from_pathSegments.join("\\");
    const to_fullPath = to_pathSegments.join("\\");

    // console.log("from_fullPath", from_fullPath);
    // console.log("to_fullPath", to_fullPath);

    try {
      await window.api.invoke("MOVE_ITEM", { from_fullPath, to_fullPath });
    } catch (error: any) {
      console.error(error);
      dispatch(openErrorSnackbarWithAlertText(error.toString()));
    }

    // TODO: refresh
  };
}

export default itemsSlice.reducer;
