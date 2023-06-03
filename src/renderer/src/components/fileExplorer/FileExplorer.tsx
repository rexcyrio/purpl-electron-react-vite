import React, { useEffect, useRef } from "react";
import DivWrapper from "./DivWrapper";
import SideScroller from "./SideScroller";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  downArrow,
  leftArrow,
  rightArrow,
  upArrow
} from "../../store/slices/fileExplorerItemsSlice";
import { fillArray } from "../../utilities/fillArray";

let didInit = false;

function FileExplorer(): JSX.Element {
  const dispatch = useAppDispatch();
  const fileExplorerRef = useRef<HTMLDivElement | null>(null);
  const numColumns = useAppSelector((state) => state.fileExplorerItems.columns.length);

  useEffect(() => {
    if (didInit) {
      return;
    }

    didInit = true;

    document.addEventListener("keydown", (event) => {
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
    });
  }, [dispatch]);

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
          display: "flex"
        }}
      >
        {fillArray(0, numColumns).map((_, columnIndex) => (
          <DivWrapper key={columnIndex} columnIndex={columnIndex} />
        ))}
      </div>

      <SideScroller fileExplorerRef={fileExplorerRef} side="left" />
      <SideScroller fileExplorerRef={fileExplorerRef} side="right" />
    </div>
  );
}

export default React.memo(FileExplorer);
