import SettingsIcon from "@mui/icons-material/Settings";
import { Button, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React, { useCallback, useState } from "react";
import ButtonWrapper from "./ButtonWrapper";
import { useAppDispatch } from "@renderer/store/hooks";

function ButtonSettings(): JSX.Element {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    // TODO: update settings
  }, []);

  return (
    <>
      <ButtonWrapper>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpen}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </ButtonWrapper>

      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Checkbox />
            <DialogContentText>Show hidden files</DialogContentText>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Discard Changes</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(ButtonSettings);
