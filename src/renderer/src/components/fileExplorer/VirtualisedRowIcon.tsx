import PropTypes from "prop-types";
import React from "react";
import MemoFolderIcon from "../icons/MemoFolderIcon";
import MemoFileIcon from "../icons/MemoFileIcon";

VirtualisedRowIcon.propTypes = {
  type: PropTypes.oneOf(["drive", "folder", "file"]).isRequired,
  isActive: PropTypes.bool.isRequired
};

function VirtualisedRowIcon({ type, isActive }): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "0.25rem"
      }}
    >
      {type === "folder" ? <MemoFolderIcon /> : <MemoFileIcon isActive={isActive} size="small" />}
    </div>
  );
}

export default React.memo(VirtualisedRowIcon);
