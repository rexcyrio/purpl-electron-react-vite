import { useAppSelector } from "@renderer/store/hooks";
import type * as CSS from "csstype";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import VirtualisedColumn from "./VirtualisedColumn";
import { selectActiveColumnIndex } from "@renderer/store/selectors/selectColumnIndex";
import { selectActiveFileExplorerItemIfAny } from "@renderer/store/selectors/selectFileExplorerItem";

ScrollableColumnDivWrapper.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

function ScrollableColumnDivWrapper({ columnIndex }): JSX.Element {
  const divWrapperRef = useRef<HTMLDivElement | null>(null);

  const activeColumnIndex = useAppSelector(selectActiveColumnIndex);

  const isActiveColumn = columnIndex === activeColumnIndex;
  const isPreviewColumn = columnIndex === activeColumnIndex + 1;

  const activeFileExplorerItem = useAppSelector(selectActiveFileExplorerItemIfAny);

  // const items = useAppSelector((state) => state.items.allItems[columnIndex]);

  // const [{ canDrop, isOver }, drop] = useDrop(
  //   () => ({
  //     accept: "virtualisedRow",
  //     drop: (item, monitor) => {
  //       const from_columnIndex = item.columnIndex;
  //       const from_rowIndex = item.rowIndex;
  //       const to_columnIndex = columnIndex;

  //       if (from_columnIndex === to_columnIndex) {
  //         return;
  //       }

  //       dispatch(moveItem(from_columnIndex, from_rowIndex, to_columnIndex));
  //     },
  //     canDrop: (item, monitor) => {
  //       // cannot move items into the first column since it is a list of drives
  //       if (columnIndex === 0) {
  //         return false;
  //       }

  //       // check for valid folder
  //       if (
  //         isColumn(items, SPECIAL_BLANK_STRING) ||
  //         isColumn(items, SPECIAL_FILE_STRING) ||
  //         isColumn(items, SPECIAL_LOADING_STRING)
  //       ) {
  //         return false;
  //       }

  //       const from_columnIndex = item.columnIndex;

  //       if (item.isSelected) {
  //         if (from_columnIndex < columnIndex) {
  //           // cannot move parent folder into its children
  //           return false;
  //         }
  //       }

  //       return true;
  //     },
  //     collect: (monitor) => ({
  //       canDrop: monitor.canDrop(),
  //       isOver: monitor.isOver()
  //     })
  //   }),
  //   [columnIndex, dispatch, items]
  // );

  useEffect(() => {
    if (divWrapperRef.current === null) {
      return;
    }

    if (isPreviewColumn) {
      divWrapperRef.current.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
    }
  }, [isPreviewColumn, activeFileExplorerItem]);

  useEffect(() => {
    if (divWrapperRef.current === null) {
      return;
    }

    if (isActiveColumn) {
      divWrapperRef.current.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
    }
  }, [isActiveColumn, activeFileExplorerItem]);

  // function divWrapperRef_fn(refElement) {
  //   divWrapperRef.current = refElement;
  //   drop(refElement);
  // }

  function getBackgroundColour(): CSS.Property.BackgroundColor {
    return "transparent";
    // if (isOver) {
    //   if (canDrop) {
    //     // lightgreen
    //     return "#91ee9154";
    //   }

    //   if (isBlankColumn) {
    //     return "transparent";
    //   }

    //   return "crimson";
    // } else {
    //   return "transparent";
    // }
  }

  return (
    <div
      ref={divWrapperRef}
      style={{
        width: "15rem",
        flexShrink: "0",
        backgroundColor: getBackgroundColour()
      }}
    >
      <VirtualisedColumn columnIndex={columnIndex} />
    </div>
  );
}

export default React.memo(ScrollableColumnDivWrapper);
