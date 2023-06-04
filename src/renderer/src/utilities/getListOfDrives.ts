import type fswin from "fswin";
import { AssertionError } from "./assertion";
import { isUpperCase } from "./isUpperCase";

export async function getListOfDrives(): Promise<fswin.LogicalDriveList> {
  const drives = await window.api.getListOfDrives();
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
