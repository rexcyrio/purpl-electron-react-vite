import { getPathComponents } from "./getPathComponents";

export type iconType =
  | "Desktop"
  | "Documents"
  | "Downloads"
  | "Music"
  | "Pictures"
  | "Videos"
  | "Other"
  | "Drive";

export function getIconType(fullPath: string): iconType {
  const pathComponents = getPathComponents(fullPath);

  if (pathComponents.length === 0) {
    return "Drive";
  }

  // "C:", "Users", "Jacob", "Downloads"
  if (pathComponents.length !== 4) {
    return "Other";
  }

  switch (pathComponents[3]) {
    case "Desktop":
      return "Desktop";
    case "Documents":
      return "Documents";
    case "Downloads":
      return "Downloads";
    case "Music":
      return "Music";
    case "Pictures":
      return "Pictures";
    case "Videos":
      return "Videos";
    default:
      return "Other";
  }
}
