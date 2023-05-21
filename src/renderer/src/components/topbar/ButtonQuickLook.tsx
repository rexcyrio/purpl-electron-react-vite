import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import {
  openOrCloseQuickLook,
  updateQuickLookIfNeeded
} from "@renderer/store/slices/quickLookSlice";
import { getActiveFileExplorerItem } from "@renderer/utilities/getActiveFileExplorerItem";
import React, { useCallback, useEffect, useMemo } from "react";
import ButtonWrapper from "./ButtonWrapper";

function ButtonQuickLook(): JSX.Element {
  const dispatch = useAppDispatch();
  const isQuickLookOpen = useAppSelector((state) => state.quickLook.isOpen);
  const activeFileExplorerItem = useAppSelector((state) => getActiveFileExplorerItem(state));

  useEffect(() => {
    dispatch(updateQuickLookIfNeeded());
  }, [dispatch, activeFileExplorerItem]);

  const handleOpenQuickLook = useCallback(() => {
    dispatch(openOrCloseQuickLook());
  }, [dispatch]);

  const handleCloseQuickLook = useCallback(() => {
    dispatch(openOrCloseQuickLook());
  }, [dispatch]);

  const closeQuickLookButton = useMemo(
    () => (
      <Tooltip title="Close QuickLook">
        <IconButton onClick={handleCloseQuickLook}>
          <VisibilityOffIcon />
        </IconButton>
      </Tooltip>
    ),
    [handleCloseQuickLook]
  );

  const openQuickLookButton = useMemo(
    () => (
      <Tooltip title="Open QuickLook">
        <IconButton onClick={handleOpenQuickLook}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    ),
    [handleOpenQuickLook]
  );

  return (
    <ButtonWrapper>{isQuickLookOpen ? closeQuickLookButton : openQuickLookButton}</ButtonWrapper>
  );
}

export default React.memo(ButtonQuickLook);
