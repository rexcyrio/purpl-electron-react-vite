import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isCreateNewFolderDialogOpenSlice = createSlice({
  name: "isCreateNewFolderDialogOpen",
  initialState,
  reducers: {
    setIsCreateNewFolderDialogOpen: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    }
  }
});

export const { setIsCreateNewFolderDialogOpen } = isCreateNewFolderDialogOpenSlice.actions;

export default isCreateNewFolderDialogOpenSlice.reducer;
