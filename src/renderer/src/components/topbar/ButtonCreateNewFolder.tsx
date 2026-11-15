import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch } from "@renderer/store/hooks";
import { useLazyCreateNewFolderQuery } from "@renderer/store/redux-toolkit-query/electronIpcApiSlice";
import { openErrorSnackbarWithAlertText } from "@renderer/store/slices/errorSnackbarSlice";
import { ReactToolkitQueryError } from "@renderer/types/types";
import { stopPropagationToDocument } from "@renderer/utilities/stopPropagationToDocument";
import { useCallback, useEffect, useState } from "react";
import ButtonWrapper from "./ButtonWrapper";

const EMPTY_HELPER_TEXT = " ";

export default function ButtonCreateNewFolder() {
  const dispatch = useAppDispatch();
  const [trigger, { error }] = useLazyCreateNewFolderQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [folderName, setFolderName] = useState("");
  const [helperText, setHelperText] = useState(EMPTY_HELPER_TEXT);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (error) {
      dispatch(openErrorSnackbarWithAlertText((error as ReactToolkitQueryError).message));
    }
  }, [dispatch, error]);

  const handleDialogOpen = useCallback(() => {
    setFolderName("");
    setHelperText(EMPTY_HELPER_TEXT);
    setIsDisabled(false);

    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const runValidationOnFolderName = useCallback((_folderName: string) => {
    const { isValid, errorMessage } = isValidFolderName(_folderName);

    if (isValid) {
      setHelperText(EMPTY_HELPER_TEXT);
    } else {
      setHelperText(errorMessage);
    }

    return isValid;
  }, []);

  const handleTextFieldChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();

      const _folderName = event.target.value;
      setFolderName(_folderName);
      runValidationOnFolderName(_folderName);
    },
    [runValidationOnFolderName]
  );

  const handleConfirm = useCallback(() => {
    setIsDisabled(true);

    // TODO: check for duplicate filename

    if (runValidationOnFolderName(folderName)) {
      trigger("C:\\Users\\Stefan Lee\\Desktop\\test"); // TODO:
      setIsDialogOpen(false);
    }

    setIsDisabled(false);
  }, [folderName, runValidationOnFolderName, trigger]);

  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleConfirm();
    },
    [handleConfirm]
  );

  const handleCancel = useCallback(() => {
    handleDialogClose();
  }, [handleDialogClose]);

  return (
    <>
      <ButtonWrapper>
        <Tooltip title="Create a new folder">
          <IconButton onClick={handleDialogOpen}>
            <CreateNewFolderIcon />
          </IconButton>
        </Tooltip>
      </ButtonWrapper>

      <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>New Folder</DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              style={{ marginTop: "0.5rem" }}
              label="Name"
              value={folderName}
              onChange={handleTextFieldChange}
              onKeyDown={stopPropagationToDocument}
              fullWidth
              disabled={isDisabled}
              error={helperText !== EMPTY_HELPER_TEXT}
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

function isValidFolderName(folderName: string): ValidateFolderNameResult {
  if (folderName === "") {
    return { isValid: false, errorMessage: "Please provide a folder name" };
  }
  if (folderName.match(regexReservedName)) {
    return { isValid: false, errorMessage: "Reserved name" };
  }
  if (folderName.match(regexReservedChar)) {
    return { isValid: false, errorMessage: 'Reserved character(s) detected < > : " / \\ | ? * ' };
  }
  if (folderName.match(regexTrailingPeriod)) {
    return { isValid: false, errorMessage: "Trailing period detected" };
  }
  if (folderName.match(regexTrailingSpace)) {
    return { isValid: false, errorMessage: "Trailing space detected" };
  }

  return { isValid: true, errorMessage: "" };
}

interface ValidateFolderNameResult {
  isValid: boolean;
  errorMessage: string;
}

const regexReservedName =
  /^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)$|^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)\..*$/;

const regexReservedChar = /[<>:"/\\|?*]/;
const regexTrailingPeriod = /^.*\.$/;
const regexTrailingSpace = /^.* $/;
