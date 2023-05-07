import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import ColumnBlank from "./ColumnBlank";
import ColumnEmptyFolder from "./ColumnEmptyFolder";
import ColumnFileInfo from "./ColumnFileInfo";
import ColumnLoading from "./ColumnLoading";
import {
  getActiveItem_columnIndex,
  getSelectedItem_rowIndex,
  SPECIAL_BLANK_STRING,
  SPECIAL_FILE_STRING,
  SPECIAL_LOADING_STRING
} from "./store/helper/itemsSliceHelper";
import VirtualisedRow from "./VirtualisedRow";

const rem = 16;
const VIRTUALISED_ROW_PADDING = 5;

VirtualisedColumn.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

function VirtualisedColumn({ columnIndex }) {
  const fixedSizeListRef = useRef(null);

  const directoryContents = useSelector((state) => state.items.allItems[columnIndex]);
  const activeItem_columnIndex = useSelector((state) => getActiveItem_columnIndex(state));
  const selectedItem_rowIndex = useSelector((state) =>
    getSelectedItem_rowIndex(state, columnIndex)
  );

  const scrollSelectedItemIntoView = useCallback(() => {
    if (fixedSizeListRef.current === null) {
      return;
    }

    if (selectedItem_rowIndex !== undefined) {
      fixedSizeListRef.current.scrollToItem(selectedItem_rowIndex);
    }
  }, [selectedItem_rowIndex]);

  // scroll selected items into view on first load only
  useEffect(() => {
    setTimeout(scrollSelectedItemIntoView, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [1] when the user navigates up to the parent folder (i.e., active column
  // changes), the parent folder should be scrolled into view
  // [2] when the user presses up / down (i.e., active row changes), the newly
  // active item should be scrolled into view
  useEffect(() => {
    scrollSelectedItemIntoView();
  }, [scrollSelectedItemIntoView, activeItem_columnIndex]);

  function getColumn() {
    if (directoryContents.length === 0) {
      return <ColumnEmptyFolder columnIndex={columnIndex} />;
    }

    switch (directoryContents[0]) {
      case SPECIAL_FILE_STRING:
        return <ColumnFileInfo />;
      case SPECIAL_BLANK_STRING:
        return <ColumnBlank />;
      case SPECIAL_LOADING_STRING:
        return <ColumnLoading />;
      default:
        break;
    }

    return (
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            ref={fixedSizeListRef}
            style={{
              overflowY: "scroll"
            }}
            height={height}
            width={width}
            overscanCount={10}
            itemCount={directoryContents.length}
            itemData={columnIndex}
            itemSize={rem + 2 * VIRTUALISED_ROW_PADDING}
            itemKey={(index_rowIndex, data_columnIndex) => {
              const self = directoryContents[index_rowIndex];

              if (typeof self === "string") {
                return self;
              } else {
                return self.name;
              }
            }}
          >
            {VirtualisedRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    );
  }

  return getColumn();
}

export default React.memo(VirtualisedColumn);
