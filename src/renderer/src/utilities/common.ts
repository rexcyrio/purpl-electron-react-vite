import { createFileExplorerFileItem } from "./FileExplorerItem";
import fswin from "fswin";

export const WINDOWS_PATH_SEPARATOR = "\\";

const FS_WIN_FILE_BLANK: fswin.Find.File = {
  LONG_NAME: "❌BLANK❌",
  SHORT_NAME: "❌BLANK❌",
  CREATION_TIME: new Date(0),
  LAST_ACCESS_TIME: new Date(0),
  LAST_WRITE_TIME: new Date(0),
  SIZE: 0,
  RAW_ATTRIBUTES: 0,
  IS_ARCHIVED: false,
  IS_COMPRESSED: false,
  IS_DEVICE: false,
  IS_DIRECTORY: false,
  IS_ENCRYPTED: false,
  IS_HIDDEN: false,
  IS_NOT_CONTENT_INDEXED: false,
  IS_OFFLINE: false,
  IS_READ_ONLY: false,
  IS_SPARSE_FILE: false,
  IS_SYSTEM: false,
  IS_TEMPORARY: false,
  IS_INTEGRITY_STREAM: false,
  IS_NO_SCRUB_DATA: false,
  IS_RECALL_ON_DATA_ACCESS: false,
  IS_RECALL_ON_OPEN: false,
  IS_VIRTUAL: false,
  IS_EA: false,
  IS_PINNED: false,
  IS_UNPINNED: false,
  REPARSE_POINT_TAG: ""
};

const FS_WIN_FILE_LOADING: fswin.Find.File = {
  LONG_NAME: "❌LOADING❌",
  SHORT_NAME: "❌LOADING❌",
  CREATION_TIME: new Date(0),
  LAST_ACCESS_TIME: new Date(0),
  LAST_WRITE_TIME: new Date(0),
  SIZE: 0,
  RAW_ATTRIBUTES: 0,
  IS_ARCHIVED: false,
  IS_COMPRESSED: false,
  IS_DEVICE: false,
  IS_DIRECTORY: false,
  IS_ENCRYPTED: false,
  IS_HIDDEN: false,
  IS_NOT_CONTENT_INDEXED: false,
  IS_OFFLINE: false,
  IS_READ_ONLY: false,
  IS_SPARSE_FILE: false,
  IS_SYSTEM: false,
  IS_TEMPORARY: false,
  IS_INTEGRITY_STREAM: false,
  IS_NO_SCRUB_DATA: false,
  IS_RECALL_ON_DATA_ACCESS: false,
  IS_RECALL_ON_OPEN: false,
  IS_VIRTUAL: false,
  IS_EA: false,
  IS_PINNED: false,
  IS_UNPINNED: false,
  REPARSE_POINT_TAG: ""
};

const FS_WIN_FILE_FILE_DETAILS: fswin.Find.File = {
  LONG_NAME: "❌FILE❌",
  SHORT_NAME: "❌FILE❌",
  CREATION_TIME: new Date(0),
  LAST_ACCESS_TIME: new Date(0),
  LAST_WRITE_TIME: new Date(0),
  SIZE: 0,
  RAW_ATTRIBUTES: 0,
  IS_ARCHIVED: false,
  IS_COMPRESSED: false,
  IS_DEVICE: false,
  IS_DIRECTORY: false,
  IS_ENCRYPTED: false,
  IS_HIDDEN: false,
  IS_NOT_CONTENT_INDEXED: false,
  IS_OFFLINE: false,
  IS_READ_ONLY: false,
  IS_SPARSE_FILE: false,
  IS_SYSTEM: false,
  IS_TEMPORARY: false,
  IS_INTEGRITY_STREAM: false,
  IS_NO_SCRUB_DATA: false,
  IS_RECALL_ON_DATA_ACCESS: false,
  IS_RECALL_ON_OPEN: false,
  IS_VIRTUAL: false,
  IS_EA: false,
  IS_PINNED: false,
  IS_UNPINNED: false,
  REPARSE_POINT_TAG: ""
};

export const SPECIAL_FILE_EXPLORER_ITEM_BLANK = createFileExplorerFileItem(FS_WIN_FILE_BLANK, "");

export const SPECIAL_FILE_EXPLORER_ITEM_LOADING = createFileExplorerFileItem(
  FS_WIN_FILE_LOADING,
  ""
);

export const SPECIAL_FILE_EXPLORER_ITEM_FILE_DETAILS = createFileExplorerFileItem(
  FS_WIN_FILE_FILE_DETAILS,
  ""
);
