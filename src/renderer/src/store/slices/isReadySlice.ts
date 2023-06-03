import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isReadySlice = createSlice({
  name: "isReady",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => action.payload
  }
});

export const { setIsReady } = isReadySlice.actions;

export default isReadySlice.reducer;
