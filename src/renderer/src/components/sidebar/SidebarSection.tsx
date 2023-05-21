import PropTypes from "prop-types";
import React from "react";

SidebarSection.propTypes = {
  headerName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

function SidebarSection({ headerName, children }): JSX.Element {
  return (
    <>
      <div
        style={{
          fontSize: "0.9rem",
          color: "gray",
          marginTop: "1.25rem",
          marginBottom: "0.5rem"
        }}
      >
        {headerName}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "start",
          flexDirection: "column",
          gap: "0.5rem"
        }}
      >
        {children}
      </div>
    </>
  );
}

export default React.memo(SidebarSection);
