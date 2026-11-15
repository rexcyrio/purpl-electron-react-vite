import { useAppDispatch } from "@renderer/store/hooks";
import { navigateToFullPath } from "@renderer/store/slices/fileExplorerItemsSlice";
import { getDisplayName } from "@renderer/utilities/getDisplayName";
import { useCallback, useState } from "react";
import SidebarRowIcon from "./SidebarRowIcon";

const PADDING_SIZE = "0.2rem";

interface SidebarRowProps {
  fullPath: string;
}

export default function SidebarRow({ fullPath }: SidebarRowProps) {
  const dispatch = useAppDispatch();
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsMouseOver(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseOver(false);
  }, []);

  const handleClick = useCallback(() => {
    dispatch(navigateToFullPath(fullPath)); // TODO:
  }, [dispatch, fullPath]);

  const displayName = getDisplayName(fullPath);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title={fullPath}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        width: `calc(100% - (${PADDING_SIZE} * 2))`,
        borderRadius: "3px",
        padding: PADDING_SIZE,
        backgroundColor: isMouseOver ? "lightblue" : "pink"
      }}
    >
      <SidebarRowIcon fullPath={fullPath} heightWidth="1.25rem" />
      <div
        style={{
          cursor: "default",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        {displayName}
      </div>
    </div>
  );
}
