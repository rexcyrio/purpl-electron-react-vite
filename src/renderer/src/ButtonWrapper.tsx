import PropTypes from "prop-types";
import React from "react";

ButtonWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

function ButtonWrapper({ children }) {
  return (
    <div
      style={{
        padding: "0.25rem"
      }}
    >
      {children}
    </div>
  );
}

export default React.memo(ButtonWrapper);
