import { getDisplayName } from "@renderer/utilities/getDisplayName";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import SidebarRowIcon from "./SidebarRowIcon";

SidebarRow.propTypes = {
  fullPath: PropTypes.string.isRequired
};

function SidebarRow({ fullPath }): JSX.Element {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsMouseOver(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseOver(false);
  }, []);

  const displayName = getDisplayName(fullPath);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

const PADDING_SIZE = "0.2rem";

export default React.memo(SidebarRow);
