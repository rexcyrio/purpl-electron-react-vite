import { WINDOWS_PATH_SEPARATOR } from "@renderer/utilities/common";
import { assertIsValidFullPath } from "./assertIsValidFullPath";
import { AssertionError } from "./assertion";

export function getPathComponents(fullPath: string): string[] {
  assertIsValidFullPath(fullPath);
  const pathComponents = fullPath.split(WINDOWS_PATH_SEPARATOR);

  const lastPathComponent = pathComponents.at(-1);

  if (lastPathComponent === undefined) {
    throw new AssertionError();
  }

  // if `fullPath` is "C:\\", the array returned after splitting will be ["C:", ""]
  if (lastPathComponent === "") {
    pathComponents.pop();
  }

  return pathComponents;
}
