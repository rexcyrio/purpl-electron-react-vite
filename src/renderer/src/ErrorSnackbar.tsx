import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { closeErrorSnackbar } from "./store/slices/errorSnackbarSlice";

function ErrorSnackbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.errorSnackbar.isOpen);
  const alertText = useAppSelector((state) => state.errorSnackbar.alertText);

  const handleClose = useCallback(() => {
    dispatch(closeErrorSnackbar());
  }, [dispatch]);

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" style={{ width: "100%" }}>
        <AlertTitle>Something went wrong!</AlertTitle>
        {alertText}
      </Alert>
    </Snackbar>
  );
}

export default React.memo(ErrorSnackbar);
