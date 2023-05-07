import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  alertText: ""
};

export const errorSnackbarSlice = createSlice({
  name: "errorSnackbar",
  initialState,
  reducers: {
    openErrorSnackbar: (state, action) => {
      const alertText = action.payload;
      state.isOpen = true;
      state.alertText = alertText;
      return state;
    },
    closeErrorSnackbar: (state, action) => {
      state.isOpen = false;
      return state;
    }
  }
});

export const { openErrorSnackbar, closeErrorSnackbar } = errorSnackbarSlice.actions;

export default errorSnackbarSlice.reducer;
