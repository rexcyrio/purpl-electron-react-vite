import PropTypes from "prop-types";
import React from "react";

ColumnWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

function ColumnWrapper({ children }) {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "scroll"
      }}
    >
      {children}
    </div>
  );
}

export default React.memo(ColumnWrapper);
