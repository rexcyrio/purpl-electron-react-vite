import { configureStore } from "@reduxjs/toolkit";
import createNewFolderReducer from "./slices/createNewFolderSlice";
import errorSnackbarReducer from "./slices/errorSnackbarSlice";
import fileStatsReducer from "./slices/fileStatsSlice";
import isDraggingReducer from "./slices/isDraggingSlice";
import isReadyReducer from "./slices/isReadySlice";
import itemsReducer from "./slices/itemsSlice";
import quickLookReducer from "./slices/quickLookSlice";

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    isReady: isReadyReducer,
    fileStats: fileStatsReducer,
    createNewFolder: createNewFolderReducer,
    quickLook: quickLookReducer,
    isDragging: isDraggingReducer,
    errorSnackbar: errorSnackbarReducer
  }
});
