import { assertIsValidFullPath } from "./assertIsValidFullPath";
import { WINDOWS_PATH_SEPARATOR } from "./common";
import { getPathComponents } from "./getPathComponents";

export function replaceBasename(fullPath: string, newBasename: string): string {
  assertIsValidFullPath(fullPath);

  const pathComponents = getPathComponents(fullPath);
  pathComponents[pathComponents.length - 1] = newBasename;

  return pathComponents.join(WINDOWS_PATH_SEPARATOR);
}
