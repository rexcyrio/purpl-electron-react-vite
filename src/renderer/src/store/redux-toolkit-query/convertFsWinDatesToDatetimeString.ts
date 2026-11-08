import type fswin from "fswin";

export default function convertFsWinDatesToDatetimeString(files: fswin.Find.File[]) {
  return files.map((file) => ({
    ...file,
    CREATION_TIME: file.CREATION_TIME.toISOString(),
    LAST_ACCESS_TIME: file.LAST_ACCESS_TIME.toISOString(),
    LAST_WRITE_TIME: file.LAST_WRITE_TIME.toISOString()
  }));
}
