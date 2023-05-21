import React from "react";
import { useAppSelector } from "@renderer/store/hooks";
import MemoFileIcon from "../icons/MemoFileIcon";
import { getActiveFileExplorerItem } from "@renderer/utilities/getActiveFileExplorerItem";

function ColumnFileInfo(): JSX.Element {
  const self = useAppSelector((state) => getActiveFileExplorerItem(state));

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
      <MemoFileIcon isActive={false} size="large" />
      <div
        style={{
          marginTop: "1rem",
          padding: "0 1rem",
          textAlign: "center",
          wordBreak: "normal",
          overflowWrap: "anywhere"
        }}
      >
        {self.displayName}
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
          {ATTRIBUTE_NAMES.map((attributeName) => (
            <div key={attributeName} style={{ color: "grey" }}>
              {attributeName}
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
          {ATTRIBUTE_NAMES.map((attributeName) => (
            <div key={attributeName}>{self[attributeName]}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ATTRIBUTE_NAMES = ["Size", "Created", "Modified", "Last opened"];

export default React.memo(ColumnFileInfo);
