import React from "react";
import MemoCircularProgress from "../icons/MemoCircularProgress";

function ColumnLoading(): JSX.Element {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "scroll",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <MemoCircularProgress />
    </div>
  );
}

export default React.memo(ColumnLoading);
