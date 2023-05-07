import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import MemoArrowRight from "./icons/MemoArrowRight";
import MemoFileIcon from "./icons/MemoFileIcon";
import MemoFolderIcon from "./icons/MemoFolderIcon";
import {
  getActiveItem_columnIndex,
  getActiveItem_rowIndex,
  getSelectedItem_rowIndex
} from "./store/helper/itemsSliceHelper";
import { setIsDragging } from "./store/slices/isDraggingSlice";
import { navigateTo } from "./store/slices/itemsSlice";
import { radioClasses } from "@mui/material";

VirtualisedRow.propTypes = {
  data: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired
};

function VirtualisedRow({ data: columnIndex, index: rowIndex, style }) {
  const dispatch = useDispatch();

  const self = useSelector((state) => state.items.allItems[columnIndex][rowIndex]);

  const fileExtension = self.name.split(".").at(-1).toLowerCase();

  const isSelected = useSelector((state) => {
    const selectedItem_rowIndex = getSelectedItem_rowIndex(state, columnIndex);
    return rowIndex === selectedItem_rowIndex;
  });

  const isActive = useSelector((state) => {
    const activeItem_columnIndex = getActiveItem_columnIndex(state);
    const activeItem_rowIndex = getActiveItem_rowIndex(state);

    return columnIndex === activeItem_columnIndex && rowIndex === activeItem_rowIndex;
  });

  // eslint-disable-next-line no-unused-vars
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "virtualisedRow",
      item: () => {
        window.api.send("ondragstart", "C:\\Users\\Stefan Lee\\Downloads");
        dispatch(setIsDragging(true));
        return { columnIndex, rowIndex, isSelected };
      },
      options: { dropEffect: "move" },
      end: (item, monitor) => {
        dispatch(setIsDragging(false));
      },
      canDrag: (monitor) => {
        return columnIndex > 0;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [dispatch, columnIndex, rowIndex, isSelected]
  );

  function virtualisedRowRef_fn(refElement) {
    if (refElement === null) {
      return;
    }

    refElement.addEventListener("click", () => {
      dispatch(navigateTo(columnIndex, rowIndex));
    });

    // drag(refElement)
  }

  const r: React.Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    r.current?.addEventListener("dragstart", (event) => {
      event.preventDefault();
      event.dataTransfer?.setData("text/plain/", "abc");
      window.api.send("ondragstart", "C:\\Users\\Stefan Lee\\Downloads\\SAF100.pdf");
    });

    r.current?.addEventListener("drop", (event) => {
      event.preventDefault();
      console.log(event);
    });
  }, []);

  function dropHandler(ev) {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }
  }

  return (
    <div
      draggable="true"
      onDrop={dropHandler}
      title={self.name}
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
          alignItems: "center",
          opacity: isDragging ? 0.4 : 1
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "0.25rem"
          }}
        >
          {self.isFolder ? (
            <MemoFolderIcon />
          ) : (
            <MemoFileIcon isActive={isActive} fileExtension={fileExtension} size="small" />
          )}
        </div>

        <span
          className="overflow-ellipsis"
          style={{
            cursor: "default",
            marginLeft: "0.25rem",
            color: isActive ? "white" : "black"
          }}
        >
          {self.name}
        </span>
      </div>

      {self.isFolder && <MemoArrowRight />}
    </div>
  );
}

function getBackgroundColour(isSelected, isActive) {
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
