import React from "react";

function ColumnBlank() {
  return (
    <div
      style={{
        height: "100%"
      }}
    >
      &nbsp;
    </div>
  );
}

export default React.memo(ColumnBlank);
