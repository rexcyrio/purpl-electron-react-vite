import LaunchIcon from "@mui/icons-material/Launch";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useLazyOpenFileExplorerQuery } from "@renderer/store/redux-toolkit-query/electronIpcApiSlice";
import React, { useCallback, useEffect } from "react";
import ButtonWrapper from "./ButtonWrapper";

export default function ButtonOpenInFileExplorer() {
  const [trigger] = useLazyOpenFileExplorerQuery();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "e":
          if (event.repeat) {
            break;
          }

          event.preventDefault();
          trigger("C:\\Users"); // TODO:
          break;

        default:
          break;
      }
    },
    [trigger]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      trigger("C:\\Users"); // TODO:
    },
    [trigger]
  );

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
