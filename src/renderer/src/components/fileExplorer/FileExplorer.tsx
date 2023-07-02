import React, { useCallback, useEffect, useRef } from "react";
import ScrollableColumnDivWrapper from "./ScrollableColumnDivWrapper";
import SideScroller from "./SideScroller";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  downArrow,
  leftArrow,
  rightArrow,
  upArrow
} from "../../store/slices/fileExplorerItemsSlice";
import { fillArray } from "../../utilities/fillArray";

function FileExplorer(): JSX.Element {
  const dispatch = useAppDispatch();
  const fileExplorerRef = useRef<HTMLDivElement | null>(null);
  const numColumns = useAppSelector((state) => state.fileExplorerItems.columns.length);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          dispatch(upArrow());
          break;

        case "ArrowDown":
          event.preventDefault();
          dispatch(downArrow());
          break;

        case "ArrowLeft":
          event.preventDefault();
          dispatch(leftArrow());
          break;

        case "ArrowRight":
          event.preventDefault();
          dispatch(rightArrow());
          break;

        default:
          break;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="file-explorer"
      style={{
        position: "relative"
      }}
    >
      <div
        ref={fileExplorerRef}
        style={{
          overflowX: "scroll",
          overflowY: "hidden",
          display: "flex",
          height: "100%"
        }}
      >
        {fillArray(0, numColumns).map((_, columnIndex) => (
          <ScrollableColumnDivWrapper key={columnIndex} columnIndex={columnIndex} />
        ))}
      </div>

      <SideScroller fileExplorerRef={fileExplorerRef} side="left" />
      <SideScroller fileExplorerRef={fileExplorerRef} side="right" />
    </div>
  );
}

export default React.memo(FileExplorer);
