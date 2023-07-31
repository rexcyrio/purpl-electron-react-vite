import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import {
  closeQuickLookUsingIfNeeded,
  toggleQuickLook,
  updateQuickLookIfNeeded
} from "@renderer/store/slices/quickLookSlice";
import React, { useCallback, useEffect, useMemo } from "react";
import ButtonWrapper from "./ButtonWrapper";
import { selectActiveFileExplorerItemIfAny } from "@renderer/store/selectors/selectFileExplorerItem";

function ButtonQuickLook(): JSX.Element {
  const dispatch = useAppDispatch();
  const isQuickLookOpen = useAppSelector((state) => state.quickLook.isOpen);
  const activeFileExplorerItem = useAppSelector(selectActiveFileExplorerItemIfAny);

  useEffect(() => {
    dispatch(updateQuickLookIfNeeded());
  }, [dispatch, activeFileExplorerItem]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case " ":
          if (event.repeat) {
            break;
          }

          event.preventDefault();
          dispatch(toggleQuickLook());
          break;

        case "Escape":
          if (event.repeat) {
            break;
          }

          event.preventDefault();
          dispatch(closeQuickLookUsingIfNeeded("currentFullPath"));
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

  const handleToggleQuickLook = useCallback(() => {
    dispatch(toggleQuickLook());
  }, [dispatch]);

  const closeQuickLookButton = useMemo(
    () => (
      <Tooltip title="Close QuickLook">
        <IconButton onClick={handleToggleQuickLook}>
          <VisibilityOffIcon />
        </IconButton>
      </Tooltip>
    ),
    [handleToggleQuickLook]
  );

  const openQuickLookButton = useMemo(
    () => (
      <Tooltip title="Open QuickLook">
        <IconButton onClick={handleToggleQuickLook}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    ),
    [handleToggleQuickLook]
  );

  return (
    <ButtonWrapper>{isQuickLookOpen ? closeQuickLookButton : openQuickLookButton}</ButtonWrapper>
  );
}

export default React.memo(ButtonQuickLook);
