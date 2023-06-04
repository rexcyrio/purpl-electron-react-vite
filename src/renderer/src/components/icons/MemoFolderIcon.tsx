import React from "react";
import FolderIcon from "@mui/icons-material/Folder";

function MemoFolderIcon(): JSX.Element {
  return (
    <FolderIcon
      style={{
        color: "#73d2fc"
      }}
    />
  );
}

export default React.memo(MemoFolderIcon);
