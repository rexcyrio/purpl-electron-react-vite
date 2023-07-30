import { FileExplorerItem } from "@renderer/utilities/FileExplorerItem";
import React from "react";
import MemoFileIcon from "../icons/MemoFileIcon";
import MemoFolderIcon from "../icons/MemoFolderIcon";

interface VirtualisedRowIconProps {
  type: FileExplorerItem["type"];
  fullPath: FileExplorerItem["fullPath"];
}

function VirtualisedRowIcon({ type, fullPath }: VirtualisedRowIconProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "0.25rem"
      }}
    >
      {type === "file" ? <MemoFileIcon filePath={fullPath} size="small" /> : <MemoFolderIcon />}
    </div>
  );
}

export default React.memo(VirtualisedRowIcon);
