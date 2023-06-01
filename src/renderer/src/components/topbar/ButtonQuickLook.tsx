import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import {
  toggleQuickLook,
  updateQuickLookIfNeeded
} from "@renderer/store/slices/quickLookSlice";
import { getActiveFileExplorerItemIfAny } from "@renderer/utilities/getActiveFileExplorerItem";
import React, { useCallback, useEffect, useMemo } from "react";
import ButtonWrapper from "./ButtonWrapper";

function ButtonQuickLook(): JSX.Element {
  const dispatch = useAppDispatch();
  const isQuickLookOpen = useAppSelector((state) => state.quickLook.isOpen);
  const activeFileExplorerItem = useAppSelector((state) => getActiveFileExplorerItemIfAny(state));

  useEffect(() => {
    dispatch(updateQuickLookIfNeeded());
  }, [dispatch, activeFileExplorerItem]);

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
