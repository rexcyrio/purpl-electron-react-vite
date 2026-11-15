import HelpIcon from "@mui/icons-material/Help";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, useEffect, useState } from "react";
import ButtonWrapper from "./ButtonWrapper";

export default function ButtonHelpWindow() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "?":
        if (event.repeat) {
          break;
        }

        event.preventDefault();
        setDialogOpen((prev) => !prev);
        break;

      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return (
    <>
      <ButtonWrapper>
        <Tooltip title="Help">
          <IconButton onClick={handleDialogOpen}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </ButtonWrapper>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Help</DialogTitle>

        <DialogContent>
          <DialogContentText>
            <code>↑ / ↓</code> : select item
          </DialogContentText>
          <DialogContentText>
            <code>←</code> : navigate up to parent folder
          </DialogContentText>
          <DialogContentText>
            <code>→</code> : navigate into folder (if selected item is a folder)
          </DialogContentText>
          <DialogContentText>
            <code>e</code> : open Windows File Explorer
          </DialogContentText>
          <DialogContentText>
            <code>q</code> : quit app
          </DialogContentText>
          <DialogContentText>
            <code>?</code> : toggle this help window
          </DialogContentText>
          <DialogContentText>
            <code>Space</code> : toggle QuickLook
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
