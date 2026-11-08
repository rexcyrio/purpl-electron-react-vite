import { configureStore } from "@reduxjs/toolkit";
import { electronIpcApi } from "./redux-toolkit-query/electronIpcApiSlice";
import errorSnackbarReducer from "./slices/errorSnackbarSlice";
import fileExplorerItemsReducer from "./slices/fileExplorerItemsSlice";
import isCreateNewFolderDialogOpenReducer from "./slices/isCreateNewFolderDialogOpenSlice";
import isDraggingReducer from "./slices/isDraggingSlice";
import isReadyReducer from "./slices/isReadySlice";
import quickLookReducer from "./slices/quickLookSlice";

export const store = configureStore({
  reducer: {
    isReady: isReadyReducer,
    isDragging: isDraggingReducer,
    isCreateNewFolderDialogOpen: isCreateNewFolderDialogOpenReducer,
    quickLook: quickLookReducer,
    errorSnackbar: errorSnackbarReducer,
    fileExplorerItems: fileExplorerItemsReducer,
    [electronIpcApi.reducerPath]: electronIpcApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(electronIpcApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
