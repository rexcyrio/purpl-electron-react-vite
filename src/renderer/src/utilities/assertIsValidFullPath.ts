import { assertTrue } from "./assertion";
import { WINDOWS_PATH_SEPARATOR } from "./common";
import { isUpperCase } from "./isUpperCase";

export function assertIsValidFullPath(fullPath: string): void {
  //  If `index` is out of range, `charAt()` returns an empty string
  assertTrue(() => isUpperCase(fullPath.charAt(0)));
  assertTrue(() => fullPath.charAt(1) === ":");

  // also ensures non-empty string
  assertTrue(() => fullPath.indexOf(WINDOWS_PATH_SEPARATOR) > -1);
}
