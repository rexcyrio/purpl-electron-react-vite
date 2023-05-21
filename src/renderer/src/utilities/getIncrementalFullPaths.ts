import { assertIsValidFullPath } from "./assertIsValidFullPath";
import { WINDOWS_PATH_SEPARATOR } from "./common";
import { getPathComponents } from "./getPathComponents";

export function getIncrementalFullPaths(fullPath: string): string[] {
  assertIsValidFullPath(fullPath);

  const pathComponents = getPathComponents(fullPath);
  const incrementalFullPaths: string[] = [];

  for (let i = 1; i < pathComponents.length + 1; i++) {
    const _fullPath = pathComponents.slice(0, i).join(WINDOWS_PATH_SEPARATOR);
    incrementalFullPaths.push(_fullPath);
  }

  // "C:" --> "C:\\"
  incrementalFullPaths[0] += WINDOWS_PATH_SEPARATOR;

  return incrementalFullPaths;
}
