import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stopPropagationToDocument } from "./App";
import ButtonWrapper from "./ButtonWrapper";
import {
  getActiveItem_columnIndex,
  getDirectoryContents,
  getFullPath,
  getPathSegments_directoryOfActiveItem
} from "./store/helper/itemsSliceHelper";
import { setCreateNewFolderDialogOpen } from "./store/slices/createNewFolderSlice";
import { openErrorSnackbar } from "./store/slices/errorSnackbarSlice";
import { refreshColumn } from "./store/slices/itemsSlice";

function ButtonCreateNewFolder() {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [helperText, setHelperText] = useState(" ");
  const [newFolderName, setNewFolderName] = useState("");

  const dialogOpen = useSelector((state) => state.createNewFolder);
  const pathSegments = useSelector((state) => getPathSegments_directoryOfActiveItem(state));
  const activeItem_columnIndex = useSelector((state) => getActiveItem_columnIndex(state));

  const handleDialogOpen = useCallback(() => {
    setIsDisabled(false);
    setHelperText(" ");
    setNewFolderName("");
    dispatch(setCreateNewFolderDialogOpen(true));
  }, [dispatch]);

  function handleDialogClose() {
    if (isDisabled) {
      return;
    }

    handleCancel();
  }

  function handleCancel() {
    dispatch(setCreateNewFolderDialogOpen(false));
  }

  async function handleConfirm() {
    setIsDisabled(true);

    const _isValid = await isValid(newFolderName);
    if (!_isValid) {
      setIsDisabled(false);
      return;
    }

    const newPathSegments = pathSegments.slice();
    newPathSegments.push(newFolderName);

    const folderPath = getFullPath(newPathSegments);

    try {
      await window.api.invoke("CREATE_NEW_FOLDER", folderPath);
    } catch (error) {
      console.error(error);
      dispatch(openErrorSnackbar(error.toString()));

      setIsDisabled(false);
      return;
    }

    dispatch(refreshColumn(activeItem_columnIndex));
  }

  function handleTextFieldChange(event) {
    event.stopPropagation();
    const _newFolderName = event.target.value;
    setNewFolderName(_newFolderName);
    isValid(_newFolderName);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleConfirm();
  }

  async function isValid(_newFolderName) {
    if (_newFolderName === "") {
      setHelperText("Please provide a folder name");
      return false;
    }
    if (_newFolderName.match(reservedName_regexp)) {
      setHelperText("Reserved name");
      return false;
    }
    if (_newFolderName.match(reservedChar_regexp)) {
      setHelperText('Reserved character(s) detected < > : " / \\ | ? * ');
      return false;
    }
    if (_newFolderName.match(trailingPeriod_regexp)) {
      setHelperText("Trailing period detected");
      return false;
    }
    if (_newFolderName.match(trailingSpace_regexp)) {
      setHelperText("Trailing space detected");
      return false;
    }
    if (await isDuplicate(_newFolderName)) {
      setHelperText("A file or folder with that name already exists");
      return false;
    }

    setHelperText(" ");
    return true;
  }

  async function isDuplicate(_newFolderName) {
    const folderPath = getFullPath(pathSegments);
    const directoryContents = await getDirectoryContents(folderPath);

    for (let i = 0; i < directoryContents.length; i++) {
      if (directoryContents[i] === _newFolderName) {
        return true;
      }
    }

    return false;
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

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
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

const reservedName_regexp =
  /^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)$|^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)\..*$/;

const reservedChar_regexp = /[<>:"/\\|?*]/;
const trailingPeriod_regexp = /^.*\.$/;
const trailingSpace_regexp = /^.* $/;

export default React.memo(ButtonCreateNewFolder);
