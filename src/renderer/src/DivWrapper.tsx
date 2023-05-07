import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveItem_columnIndex,
  getActiveItem_rowIndex,
  isColumn,
  SPECIAL_BLANK_STRING,
  SPECIAL_FILE_STRING,
  SPECIAL_LOADING_STRING
} from "./store/helper/itemsSliceHelper";
import { moveItem, removeColumnsToTheRightOf } from "./store/slices/itemsSlice";
import VirtualisedColumn from "./VirtualisedColumn";

DivWrapper.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

function DivWrapper({ columnIndex }) {
  const dispatch = useDispatch();
  const divWrapperRef = useRef(null);

  const isBlankColumn = useSelector((state) =>
    isColumn(state.items.allItems[columnIndex], SPECIAL_BLANK_STRING)
  );
  const activeItem_columnIndex = useSelector((state) => getActiveItem_columnIndex(state));
  const activeItem_rowIndex = useSelector((state) => getActiveItem_rowIndex(state));
  const items = useSelector((state) => state.items.allItems[columnIndex]);

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "virtualisedRow",
      drop: (item, monitor) => {
        const from_columnIndex = item.columnIndex;
        const from_rowIndex = item.rowIndex;
        const to_columnIndex = columnIndex;

        if (from_columnIndex === to_columnIndex) {
          return;
        }

        dispatch(moveItem(from_columnIndex, from_rowIndex, to_columnIndex));
      },
      canDrop: (item, monitor) => {
        // cannot move items into the first column since it is a list of drives
        if (columnIndex === 0) {
          return false;
        }

        // check for valid folder
        if (
          isColumn(items, SPECIAL_BLANK_STRING) ||
          isColumn(items, SPECIAL_FILE_STRING) ||
          isColumn(items, SPECIAL_LOADING_STRING)
        ) {
          return false;
        }

        const from_columnIndex = item.columnIndex;

        if (item.isSelected) {
          if (from_columnIndex < columnIndex) {
            // cannot move parent folder into its children
            return false;
          }
        }

        return true;
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
      })
    }),
    [columnIndex, dispatch, items]
  );

  useEffect(() => {
    if (divWrapperRef.current === null) {
      return;
    }

    const isActiveColumn = columnIndex === activeItem_columnIndex;
    const isPreviewColumn =
      columnIndex === activeItem_columnIndex + 1 && activeItem_rowIndex !== -1;

    if (isActiveColumn || isPreviewColumn) {
      divWrapperRef.current.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
      return;
    }

    if (isBlankColumn) {
      const rect = divWrapperRef.current.getBoundingClientRect();
      const windowInnerWidth = window.innerWidth;
      if (rect.left > windowInnerWidth) {
        dispatch(removeColumnsToTheRightOf(columnIndex));
      }
    }
  }, [activeItem_columnIndex, activeItem_rowIndex, isBlankColumn, columnIndex, dispatch]);

  function divWrapperRef_fn(refElement) {
    divWrapperRef.current = refElement;
    drop(refElement);
  }

  function getBackgroundColour() {
    if (isOver) {
      if (canDrop) {
        // lightgreen
        return "#91ee9154";
      }

      if (isBlankColumn) {
        return "transparent";
      }

      return "crimson";
    } else {
      return "transparent";
    }
  }

  return (
    <div
      ref={divWrapperRef_fn}
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
