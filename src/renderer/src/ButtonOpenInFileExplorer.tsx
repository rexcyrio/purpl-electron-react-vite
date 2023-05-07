import LaunchIcon from "@mui/icons-material/Launch";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import ButtonWrapper from "./ButtonWrapper";
import { openFileExplorer } from "./store/slices/itemsSlice";

function ButtonOpenInFileExplorer() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "e":
          if (event.repeat) {
            break;
          }

          event.preventDefault();
          dispatch(openFileExplorer());
          break;

        default:
          break;
      }
    });
  }, [dispatch]);

  function handleClick(event) {
    event.preventDefault();
    dispatch(openFileExplorer());
  }

  return (
    <ButtonWrapper>
      <Tooltip title="Open in Windows File Explorer">
        <IconButton onClick={handleClick}>
          <LaunchIcon />
        </IconButton>
      </Tooltip>
    </ButtonWrapper>
  );
}

export default React.memo(ButtonOpenInFileExplorer);
