import { useAppSelector } from "@renderer/store/hooks";
import { selectActiveFileExplorerItem } from "@renderer/store/selectors/selectFileExplorerItem";
import React from "react";
import MemoFileIcon from "../icons/MemoFileIcon";

function ColumnFileInfo(): JSX.Element {
  const self = useAppSelector(selectActiveFileExplorerItem);

  return (
    <div
      style={{
        height: "100%",
        overflowY: "scroll",
        display: "flex"
      }}
    >
      <div
        style={{
          // see https://stackoverflow.com/a/33455342 for why "margin: auto" was used
          // instead of "align-items: center" and "justify-content: center"
          margin: "auto"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem"
          }}
        >
          <MemoFileIcon filePath={self.fullPath} size="large" />
          <div
            style={{
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
              gap: "0.5rem"
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

                width: "7.5rem"
              }}
            >
              {ATTRIBUTE_NAMES.map((attributeName) => (
                <div key={attributeName}>{self[attributeName]}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ATTRIBUTE_NAMES = ["Size", "Created", "Modified", "Last opened"];

export default React.memo(ColumnFileInfo);
