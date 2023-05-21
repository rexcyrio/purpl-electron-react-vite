import { AssertionError } from "./assertion";
import { isUpperCase } from "./isUpperCase";

type DriveType = "NO_ROOT_DIR" | "REMOVABLE" | "FIXED" | "REMOTE" | "CDROM" | "RAMDISK" | "UNKNOWN";

interface LogicalDriveList {
  [key: string]: DriveType;
}

export async function getListOfDrives(): Promise<LogicalDriveList> {
  const drives = await window.api.invoke("GET_LIST_OF_DRIVES", null);
  const driveLetters = Object.keys(drives);

  for (const driveLetter of driveLetters) {
    if (driveLetter.length === 1 && isUpperCase(driveLetter)) {
      // do nothing
    } else {
      throw new AssertionError();
    }
  }

  return drives;
}
