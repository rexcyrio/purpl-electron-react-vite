import LaunchIcon from "@mui/icons-material/Launch";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch } from "@renderer/store/hooks";
import React, { useCallback, useEffect } from "react";
import ButtonWrapper from "./ButtonWrapper";
import { openFileExplorer } from "@renderer/store/slices/fileExplorerItemsSlice";

function ButtonOpenInFileExplorer(): JSX.Element {
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
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
