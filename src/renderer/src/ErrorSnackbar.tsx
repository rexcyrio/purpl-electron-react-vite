import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeErrorSnackbar } from "./store/slices/errorSnackbarSlice";

function ErrorSnackbar() {
  const dispatch = useDispatch();
  const isRefreshing = useRef(false);
  const [open, setOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const redux_open = useSelector((state) => state.errorSnackbar.isOpen);
  const redux_alertText = useSelector((state) => state.errorSnackbar.alertText);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setAlertText(redux_alertText);
  }, [redux_alertText]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!redux_open && open) {
      handleClose();
      return;
    }

    if (redux_open && !open) {
      if (!isRefreshing.current) {
        handleOpen();
      }
      return;
    }

    if (redux_open && open && alertText !== redux_alertText) {
      isRefreshing.current = true;
      handleClose();

      setTimeout(() => {
        isRefreshing.current = false;
        handleOpen();
      }, 100);

      return;
    }
  }, [redux_open, open, alertText, redux_alertText, handleOpen, handleClose]);

  function handleSnackbarClose() {
    dispatch(closeErrorSnackbar());
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity="error" style={{ width: "100%" }}>
        <AlertTitle>Something went wrong!</AlertTitle>
        {alertText}
      </Alert>
    </Snackbar>
  );
}

export default React.memo(ErrorSnackbar);
