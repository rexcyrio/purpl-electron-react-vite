import { AssertionError } from "./assertion";
import { getPathComponents } from "./getPathComponents";

export function getDisplayName(fullPath: string): string {
  const pathComponents = getPathComponents(fullPath);
  const displayName = pathComponents.at(-1);

  if (displayName === undefined) {
    throw new AssertionError();
  }

  return displayName;
}
