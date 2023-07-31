import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import { navigateTo } from "@renderer/store/slices/fileExplorerItemsSlice";
import type * as CSS from "csstype";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";
import MemoArrowRight from "../icons/MemoArrowRight";
import VirtualisedRowDisplayName from "./VirtualisedRowDisplayName";
import VirtualisedRowIcon from "./VirtualisedRowIcon";
import { selectActiveFileExplorerItemIfAny, selectFileExplorerItem, selectSelectedFileExplorerItemInColumnIfAny } from "@renderer/store/selectors/selectFileExplorerItem";

VirtualisedRow.propTypes = {
  data: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired
};

function VirtualisedRow({ data: columnIndex, index: rowIndex, style }): JSX.Element {
  const dispatch = useAppDispatch();
  const virtualisedRowRef = useRef<HTMLDivElement | null>(null);

  const self = useAppSelector((state) => selectFileExplorerItem(state, columnIndex, rowIndex));

  const isActive = useAppSelector((state) => self === selectActiveFileExplorerItemIfAny(state));

  const isSelected = useAppSelector(
    (state) => self === selectSelectedFileExplorerItemInColumnIfAny(state, columnIndex)
  );

  const handleDragStart = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      window.api.startDrag(self.fullPath);
    },
    [self.fullPath]
  );

  useEffect(() => {
    if (virtualisedRowRef.current === null) {
      return;
    }

    virtualisedRowRef.current.addEventListener("dragstart", handleDragStart);

    const ref = virtualisedRowRef.current;
    return () => ref.removeEventListener("dragstart", handleDragStart);
  }, [handleDragStart]);

  // const [{ isDragging }, drag, dragPreview] = useDrag(
  //   () => ({
  //     type: "virtualisedRow",
  //     item: () => {
  //       window.api.send("ondragstart", "C:\\Users\\Stefan Lee\\Downloads");
  //       dispatch(setIsDragging(true));
  //       return { columnIndex, rowIndex, isSelected };
  //     },
  //     options: { dropEffect: "move" },
  //     end: (item, monitor) => {
  //       dispatch(setIsDragging(false));
  //     },
  //     canDrag: (monitor): boolean => {
  //       return columnIndex > 0;
  //     },
  //     collect: (monitor) => ({
  //       isDragging: monitor.isDragging()
  //     })
  //   }),
  //   [dispatch, columnIndex, rowIndex, isSelected]
  // );

  // function virtualisedRowRef_fn(refElement) {
  //   if (refElement === null) {
  //     return;
  //   }

  //   refElement.addEventListener("click", () => {
  //     dispatch(navigateTo(columnIndex, rowIndex));
  //   });

  //   // drag(refElement)
  // }

  // ==========================================================================

  // ==========================================================================

  // function dropHandler(ev) {
  //   console.log("File(s) dropped");

  //   // Prevent default behavior (Prevent file from being opened)
  //   ev.preventDefault();

  //   if (ev.dataTransfer.items) {
  //     // Use DataTransferItemList interface to access the file(s)
  //     [...ev.dataTransfer.items].forEach((item, i) => {
  //       // If dropped items aren't files, reject them
  //       if (item.kind === "file") {
  //         const file = item.getAsFile();
  //         console.log(`… file[${i}].name = ${file.name}`);
  //       }
  //     });
  //   } else {
  //     // Use DataTransfer interface to access the file(s)
  //     [...ev.dataTransfer.files].forEach((file, i) => {
  //       console.log(`… file[${i}].name = ${file.name}`);
  //     });
  //   }
  // }

  const handleClick = useCallback(() => {
    dispatch(navigateTo(columnIndex, rowIndex));
  }, [dispatch, columnIndex, rowIndex]);

  return (
    <div
      draggable="true"
      // onDrop={dropHandler}
      onClick={handleClick}
      title={self.displayName}
      ref={virtualisedRowRef}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: getBackgroundColour(isActive, isSelected)
      }}
    >
      <div
        style={{
          width: "calc(100% - 1.75rem)",
          display: "flex",
          alignItems: "center"
          // opacity: isDragging ? 0.4 : 1
        }}
      >
        <VirtualisedRowIcon type={self.type} fullPath={self.fullPath} />
        <VirtualisedRowDisplayName displayName={self.displayName} isActive={isActive} />
      </div>

      {self.type === "folder" && <MemoArrowRight />}
    </div>
  );
}

function getBackgroundColour(isActive: boolean, isSelected: boolean): CSS.Property.BackgroundColor {
  if (isActive) {
    return "#0068d9";
  }

  if (isSelected) {
    return "#dcdcdc";
  } else {
    return "transparent";
  }
}

export default React.memo(VirtualisedRow);
