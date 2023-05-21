import React from "react";

function ColumnBlank(): JSX.Element {
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
