import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isDraggingSlice = createSlice({
  name: "isDragging",
  initialState,
  reducers: {
    setIsDragging: (state, action) => action.payload
  }
});

export const { setIsDragging } = isDraggingSlice.actions;

export default isDraggingSlice.reducer;
