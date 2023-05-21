import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import VirtualisedColumn from "./VirtualisedColumn";
import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import { isFirstFileExplorerItemInColumnEqualTo } from "@renderer/utilities/isFirstFileExplorerItemInColumnEqualTo";
import { SPECIAL_FILE_EXPLORER_ITEM_BLANK } from "@renderer/utilities/common";
import { getColumnIndexAndRowIndexOfActiveFileExplorerItem } from "@renderer/utilities/getColumnIndexAndRowIndexOfActiveFileExplorerItem";
import { removeColumnsToTheRightOf } from "@renderer/store/slices/itemsSlice";

DivWrapper.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

function DivWrapper({ columnIndex }): JSX.Element {
  const dispatch = useAppDispatch();
  const divWrapperRef = useRef<HTMLDivElement | null>(null);

  const isBlankColumn = useAppSelector((state) =>
    isFirstFileExplorerItemInColumnEqualTo(state, columnIndex, SPECIAL_FILE_EXPLORER_ITEM_BLANK)
  );

  const [isActiveColumn, isPreviewColumn] = useAppSelector((state) => {
    const [activeColumnIndex, activeRowIndex] =
      getColumnIndexAndRowIndexOfActiveFileExplorerItem(state);

    const _isActiveColumn = columnIndex === activeColumnIndex;
    const _isPreviewColumn = columnIndex === activeColumnIndex + 1;
    return [_isActiveColumn, _isPreviewColumn];
  });

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

    if (isBlankColumn) {
      const rect = divWrapperRef.current.getBoundingClientRect();
      const windowInnerWidth = window.innerWidth;

      if (rect.left > windowInnerWidth) {
        dispatch(removeColumnsToTheRightOf(columnIndex));
      }
    }
  }, [isBlankColumn, dispatch, columnIndex]);

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
  }, [isPreviewColumn]);

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
  }, [isActiveColumn]);

  // function divWrapperRef_fn(refElement) {
  //   divWrapperRef.current = refElement;
  //   drop(refElement);
  // }

  function getBackgroundColour(): string {
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
        height: "calc(100vh - 4rem - 1px)",
        width: "15rem",
        flexShrink: "0",
        verticalAlign: "top",
        backgroundColor: getBackgroundColour()
      }}
    >
      <VirtualisedColumn columnIndex={columnIndex} />
    </div>
  );
}

export default React.memo(DivWrapper);
