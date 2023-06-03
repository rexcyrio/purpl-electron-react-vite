import HelpIcon from "@mui/icons-material/Help";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import ButtonWrapper from "./ButtonWrapper";

let didInit = false;

function ButtonHelpWindow(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (didInit) {
      return;
    }

    didInit = true;

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "?":
          if (event.repeat) {
            break;
          }

          event.preventDefault();
          setDialogOpen(!dialogOpen);
          break;

        default:
          break;
      }
    });
  }, [dialogOpen]);

  function handleDialogOpen(): void {
    setDialogOpen(true);
  }

  function handleDialogClose(): void {
    setDialogOpen(false);
  }

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
            <code>←</code> : navigate to parent folder
          </DialogContentText>
          <DialogContentText>
            <code>→</code> : open into folder (if selected item is a folder)
          </DialogContentText>
          <DialogContentText>
            <code>e</code> : open Windows File Explorer here
          </DialogContentText>
          <DialogContentText>
            <code>q</code> : quit app
          </DialogContentText>
          <DialogContentText>
            <code>?</code> : toggle this help window
          </DialogContentText>
          <DialogContentText>
            <code>Space</code> : toggle QuickLook.exe
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(ButtonHelpWindow);
