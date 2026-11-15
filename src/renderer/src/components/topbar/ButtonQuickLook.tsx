import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import { selectActiveFileExplorerItemIfAny } from "@renderer/store/selectors/selectFileExplorerItem";
import {
  closeQuickLookUsingIfNeeded,
  toggleQuickLook,
  updateQuickLookIfNeeded
} from "@renderer/store/slices/quickLookSlice";
import { useCallback, useEffect } from "react";
import ButtonWrapper from "./ButtonWrapper";

export default function ButtonQuickLook() {
  const dispatch = useAppDispatch();
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

  return (
    <ButtonWrapper>
      <Tooltip title="Toggle QuickLook">
        <IconButton onClick={handleToggleQuickLook}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    </ButtonWrapper>
  );
}
