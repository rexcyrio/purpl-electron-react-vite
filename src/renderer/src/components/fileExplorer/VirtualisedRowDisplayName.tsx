import PropTypes from "prop-types";
import React from "react";

VirtualisedRowDisplayName.propTypes = {
  displayName: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired
};

function VirtualisedRowDisplayName({ displayName, isActive }): JSX.Element {
  return (
    <span
      className="overflow-ellipsis"
      style={{
        cursor: "default",
        marginLeft: "0.25rem",
        color: isActive ? "white" : "black"
      }}
    >
      {displayName}
    </span>
  );
}

export default React.memo(VirtualisedRowDisplayName);
