import React from "react";
import { FaFolder } from "react-icons/fa";

function MemoFolderIcon(): JSX.Element {
  return (
    <FaFolder
      style={{
        height: "1.25rem",
        width: "1.25rem",
        color: "#73d2fc",
        flexShrink: "0"
      }}
    />
  );
}

export default React.memo(MemoFolderIcon);
