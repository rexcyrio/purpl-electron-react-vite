import { WINDOWS_PATH_SEPARATOR } from "./common";

export function removeTrailingPathSeparatorIfNeeded(s: string): string {
  if (s.endsWith(WINDOWS_PATH_SEPARATOR)) {
    return s.slice(0, -1);
  } else {
    return s;
  }
}
