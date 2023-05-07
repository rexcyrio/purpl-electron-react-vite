import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const createNewFolderSlice = createSlice({
  name: "createNewFolder",
  initialState,
  reducers: {
    setCreateNewFolderDialogOpen: (state, action) => action.payload
  }
});

export const { setCreateNewFolderDialogOpen } = createNewFolderSlice.actions;

export default createNewFolderSlice.reducer;
