import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DivWrapper from "./DivWrapper";
import SideScroller from "./SideScroller";
import { downArrow, leftArrow, rightArrow, upArrow } from "./store/slices/itemsSlice";
import { toggleQuickLook } from "./store/slices/quickLookSlice";

function MainContent() {
  const mainContentRef = useRef(null);
  const dispatch = useDispatch();
  const numColumns = useSelector((state) => state.items.allItems.length);

  useEffect(() => {
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

        case " ":
          if (event.repeat) {
            break;
          }

          event.preventDefault();
          dispatch(toggleQuickLook());
          break;

        default:
          break;
      }
    });
  }, [dispatch]);

  return (
    <div
      className="main-content"
      style={{
        position: "relative"
      }}
    >
      <div
        ref={mainContentRef}
        style={{
          overflowX: "scroll",
          display: "flex"
        }}
      >
        {generateArray(0, numColumns).map((_, columnIndex) => (
          <DivWrapper key={columnIndex} columnIndex={columnIndex} />
        ))}
      </div>

      <SideScroller mainContentRef={mainContentRef} side="left" />
      <SideScroller mainContentRef={mainContentRef} side="right" />
    </div>
  );
}

function generateArray(value, count) {
  const arr = [];

  for (let i = 0; i < count; i++) {
    arr.push(value);
  }

  return arr;
}

export default React.memo(MainContent);
