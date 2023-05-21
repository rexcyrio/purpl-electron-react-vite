import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect } from "react";
import ErrorSnackbar from "./ErrorSnackbar";
import FileExplorer from "./components/fileExplorer/FileExplorer";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { initReduxStore } from "./store/slices/fileExplorerItemsSlice";
import { apiQuitApp } from "./utilities/api";

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const isReady = useAppSelector((state) => state.isReady);

  useEffect(() => {
    dispatch(initReduxStore());
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "q":
          if (event.repeat) {
            break;
          }

          event.preventDefault();
          apiQuitApp();
          break;

        default:
          break;
      }
    });
  }, []);

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
