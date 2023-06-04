import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import { navigateTo } from "@renderer/store/slices/fileExplorerItemsSlice";
import { getActiveFileExplorerItemIfAny } from "@renderer/utilities/getActiveFileExplorerItem";
import { getFileExplorerItem } from "@renderer/utilities/getFileExplorerItem";
import { getSelectedFileExplorerItemInColumnIfAny } from "@renderer/utilities/getSelectedFileExplorerItemInColumn";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";
import MemoArrowRight from "../icons/MemoArrowRight";
import VirtualisedRowDisplayName from "./VirtualisedRowDisplayName";
import VirtualisedRowIcon from "./VirtualisedRowIcon";

VirtualisedRow.propTypes = {
  data: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired
};

function VirtualisedRow({ data: columnIndex, index: rowIndex, style }): JSX.Element {
  const dispatch = useAppDispatch();

  const self = useAppSelector((state) => getFileExplorerItem(state, columnIndex, rowIndex));

  const isSelected = useAppSelector(
    (state) => self === getSelectedFileExplorerItemInColumnIfAny(state, columnIndex)
  );

  const isActive = useAppSelector((state) => self === getActiveFileExplorerItemIfAny(state));

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

  const r: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    r.current?.addEventListener("dragstart", (event) => {
      event.preventDefault();
      event.dataTransfer?.setData("text/plain/", "abc");
      // window.api.send("ondragstart", "C:\\Users\\Stefan Lee\\Downloads\\SAF100.pdf");
    });

    r.current?.addEventListener("drop", (event) => {
      event.preventDefault();
      console.log(event);
    });
  }, []);

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
      ref={r}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: getBackgroundColour(isSelected, isActive)
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
        <VirtualisedRowIcon self={self} />
        <VirtualisedRowDisplayName displayName={self.displayName} isActive={isActive} />
      </div>

      {self.type === "folder" && <MemoArrowRight />}
    </div>
  );
}

function getBackgroundColour(isSelected: boolean, isActive: boolean): string {
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
