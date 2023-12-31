import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useCallback, useEffect } from "react";
import ErrorSnackbar from "./ErrorSnackbar";
import FileExplorer from "./components/fileExplorer/FileExplorer";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { initReduxStore } from "./store/slices/fileExplorerItemsSlice";

let didInit = false;

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const isReady = useAppSelector((state) => state.isReady);

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      dispatch(initReduxStore());
    }
  }, [dispatch]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "q":
        if (event.repeat) {
          break;
        }

        event.preventDefault();
        window.api.quitApp();
        break;

      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {isReady ? (
        <>
          <div className="grid-container">
            <Topbar />
            <Sidebar />
            <FileExplorer />
          </div>

          <ErrorSnackbar />
        </>
      ) : (
        <Backdrop open={true}>
          <CircularProgress />
        </Backdrop>
      )}
    </>
  );
}

export default React.memo(App);
