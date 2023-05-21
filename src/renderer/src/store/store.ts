import { configureStore } from "@reduxjs/toolkit";
import isCreateNewFolderDialogOpenReducer from "./slices/isCreateNewFolderDialogOpenSlice";
import errorSnackbarReducer from "./slices/errorSnackbarSlice";
import fileExplorerItemsReducer from "./slices/fileExplorerItemsSlice";
import isDraggingReducer from "./slices/isDraggingSlice";
import quickLookReducer from "./slices/quickLookSlice";
import isReadyReducer from "./slices/isReadySlice";

export const store = configureStore({
  reducer: {
    isReady: isReadyReducer,
    isDragging: isDraggingReducer,
    isCreateNewFolderDialogOpen: isCreateNewFolderDialogOpenReducer,
    quickLook: quickLookReducer,
    errorSnackbar: errorSnackbarReducer,
    fileExplorerItems: fileExplorerItemsReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
