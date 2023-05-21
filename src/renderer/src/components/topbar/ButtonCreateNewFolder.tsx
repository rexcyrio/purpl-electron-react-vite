import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import { createNewFolder, isDuplicateName } from "@renderer/store/slices/fileExplorerItemsSlice";
import { stopPropagationToDocument } from "@renderer/utilities/stopPropagationToDocument";
import React, { useCallback, useMemo, useState } from "react";
import { setIsCreateNewFolderDialogOpen } from "../../store/slices/isCreateNewFolderDialogOpenSlice";
import ButtonWrapper from "./ButtonWrapper";

function ButtonCreateNewFolder(): JSX.Element {
  const dispatch = useAppDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [helperText, setHelperText] = useState(" ");
  const [newFolderName, setNewFolderName] = useState("");

  const isDialogOpen = useAppSelector((state) => state.isCreateNewFolderDialogOpen);

  const isValid = useCallback(
    async (_newFolderName: string): Promise<boolean> => {
      if (_newFolderName === "") {
        setHelperText("Please provide a folder name");
        return false;
      }
      if (_newFolderName.match(reReservedName)) {
        setHelperText("Reserved name");
        return false;
      }
      if (_newFolderName.match(reReservedChar)) {
        setHelperText('Reserved character(s) detected < > : " / \\ | ? * ');
        return false;
      }
      if (_newFolderName.match(reTrailingPeriod)) {
        setHelperText("Trailing period detected");
        return false;
      }
      if (_newFolderName.match(reTrailingSpace)) {
        setHelperText("Trailing space detected");
        return false;
      }

      const _isDuplicateName = await dispatch(isDuplicateName(_newFolderName));
      if (_isDuplicateName) {
        setHelperText("A file or folder with that name already exists");
        return false;
      }

      setHelperText(" ");
      return true;
    },
    [dispatch]
  );

  const handleCancel = useCallback(() => {
    dispatch(setIsCreateNewFolderDialogOpen(false));
  }, [dispatch]);

  const handleConfirm = useCallback(async () => {
    setIsDisabled(true);

    const _isValid = await isValid(newFolderName);

    if (!_isValid) {
      setIsDisabled(false);
      return;
    }

    dispatch(createNewFolder(newFolderName));
  }, [dispatch, isValid, newFolderName]);

  const handleDialogOpen = useCallback(() => {
    setIsDisabled(false);
    setHelperText(" ");
    setNewFolderName("");
    dispatch(setIsCreateNewFolderDialogOpen(true));
  }, [dispatch]);

  const handleDialogClose = useCallback(() => {
    if (isDisabled) {
      return;
    }

    handleCancel();
  }, [handleCancel, isDisabled]);

  function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>): void {
    event.stopPropagation();
    const _newFolderName = event.target.value;
    setNewFolderName(_newFolderName);
    isValid(_newFolderName);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    handleConfirm();
  }

  const memoTooltipIconButton = useMemo(
    () => (
      <ButtonWrapper>
        <Tooltip title="Create a new folder">
          <IconButton onClick={handleDialogOpen}>
            <CreateNewFolderIcon />
          </IconButton>
        </Tooltip>
      </ButtonWrapper>
    ),
    [handleDialogOpen]
  );

  return (
    <>
      {memoTooltipIconButton}

      <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>New Folder</DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              style={{ marginTop: "0.5rem" }}
              label="Name"
              value={newFolderName}
              onChange={handleTextFieldChange}
              onKeyDown={stopPropagationToDocument}
              fullWidth
              disabled={isDisabled}
              error={helperText !== " "}
              helperText={helperText}
              autoFocus
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button disabled={isDisabled} onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={isDisabled} onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const reReservedName =
  /^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)$|^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)\..*$/;

const reReservedChar = /[<>:"/\\|?*]/;
const reTrailingPeriod = /^.*\.$/;
const reTrailingSpace = /^.* $/;

export default React.memo(ButtonCreateNewFolder);
