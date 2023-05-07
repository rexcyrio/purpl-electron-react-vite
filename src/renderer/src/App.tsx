import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorSnackbar from "./ErrorSnackbar";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { initReduxStore } from "./store/slices/itemsSlice";
import Topbar from "./Topbar";

function App() {
  const dispatch = useDispatch();
  const isReady = useSelector((state) => state.isReady);

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
          window.api.send("QUIT");
          break;

        default:
          break;
      }
    });
  }, [dispatch]);

  return (
    isReady && (
      <>
        <div className="grid-container">
          <Topbar />
          <Sidebar />
          <MainContent />
        </div>

        <ErrorSnackbar />
      </>
    )
  );
}

export function stopPropagationToDocument(event) {
  switch (event.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    case "e":
    case "q":
    case "?":
    case " ":
      event.stopPropagation();
      break;

    default:
      break;
  }
}

export default React.memo(App);
