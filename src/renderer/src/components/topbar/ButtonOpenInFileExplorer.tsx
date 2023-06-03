import LaunchIcon from "@mui/icons-material/Launch";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch } from "@renderer/store/hooks";
import React, { useEffect } from "react";
import ButtonWrapper from "./ButtonWrapper";

let didInit = false;

function ButtonOpenInFileExplorer(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (didInit) {
      return;
    }

    didInit = true;

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "e":
          if (event.repeat) {
            break;
          }

          event.preventDefault();
          // dispatch(openFileExplorer());
          break;

        default:
          break;
      }
    });
  }, [dispatch]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    // dispatch(openFileExplorer());
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
