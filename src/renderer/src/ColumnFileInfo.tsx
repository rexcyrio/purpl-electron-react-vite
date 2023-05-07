import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MemoFileIcon from "./icons/MemoFileIcon";
import { getActiveItem } from "./store/helper/itemsSliceHelper";
import { getFileStats, resetFileStats } from "./store/slices/fileStatsSlice";

function ColumnFileInfo() {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.fileStats);
  const self = useSelector((state) => getActiveItem(state));
  const fileExtension = self.name.split(".").at(-1).toLowerCase();

  useEffect(() => {
    dispatch(getFileStats());

    return () => dispatch(resetFileStats());
  }, [dispatch]);

  return (
    <div
      style={{
        height: "100%",
        overflowY: "scroll",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <MemoFileIcon isActive={false} fileExtension={fileExtension} size="large" />
      <div
        style={{
          marginTop: "1rem",
          padding: "0 1rem",
          textAlign: "center",
          wordBreak: "normal",
          overflowWrap: "anywhere"
        }}
      >
        {self.name}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: "0.75rem",
          marginTop: "1rem"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end"
          }}
        >
          {Object.keys(mappingDisplayNameToKey).map((displayName) => (
            <div key={displayName} style={{ color: "grey" }}>
              {displayName}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",

            marginLeft: "0.5rem",
            width: "7.75rem"
          }}
        >
          {Object.values(mappingDisplayNameToKey).map((key) => (
            <div key={key}>{stats === null ? "" : stats[key]}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const mappingDisplayNameToKey = {
  Size: "size",
  Created: "birthtime",
  Modified: "mtime",
  "Last opened": "atime"
};

export default React.memo(ColumnFileInfo);
