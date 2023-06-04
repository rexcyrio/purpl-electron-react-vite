import { FileExplorerItem } from "@renderer/utilities/FileExplorerItem";
import React from "react";
import MemoFileIcon from "../icons/MemoFileIcon";
import MemoFolderIcon from "../icons/MemoFolderIcon";

interface VirtualisedRowIconProps {
  self: FileExplorerItem;
}

function VirtualisedRowIcon({ self }: VirtualisedRowIconProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "0.25rem"
      }}
    >
      {self.type === "file" ? (
        <MemoFileIcon filePath={self.fullPath} size="small" />
      ) : (
        <MemoFolderIcon />
      )}
    </div>
  );
}

export default React.memo(VirtualisedRowIcon);
