import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ErrorSnackbarState {
  isOpen: boolean;
  alertText: string;
}

const initialState: ErrorSnackbarState = {
  isOpen: false,
  alertText: ""
};

export const errorSnackbarSlice = createSlice({
  name: "errorSnackbar",
  initialState,
  reducers: {
    openErrorSnackbarWithAlertText: (state, action: PayloadAction<string>) => {
      const alertText = action.payload;

      state.isOpen = true;
      state.alertText = alertText;
      return state;
    },
    closeErrorSnackbar: (state, action) => {
      return initialState;
    }
  }
});

export const { openErrorSnackbarWithAlertText, closeErrorSnackbar } = errorSnackbarSlice.actions;

export default errorSnackbarSlice.reducer;
