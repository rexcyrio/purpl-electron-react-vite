import LaunchIcon from "@mui/icons-material/Launch";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch } from "@renderer/store/hooks";
import { apiGetFSStats } from "@renderer/utilities/api";
import React, { useEffect } from "react";
import ButtonWrapper from "./ButtonWrapper";

function ButtonOpenInFileExplorer(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
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
    apiGetFSStats("C:\\Users\\Stefan Lee\\Downloads\\SAF100.pdf").then(console.log);
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
