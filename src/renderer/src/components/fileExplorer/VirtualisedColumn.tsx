import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { useAppSelector } from "../../store/hooks";
import {
  SPECIAL_FILE_EXPLORER_ITEM_BLANK,
  SPECIAL_FILE_EXPLORER_ITEM_FILE_DETAILS,
  SPECIAL_FILE_EXPLORER_ITEM_LOADING
} from "../../utilities/common";
import ColumnBlank from "./ColumnBlank";
import ColumnEmptyFolder from "./ColumnEmptyFolder";
import ColumnFileInfo from "./ColumnFileInfo";
import ColumnLoading from "./ColumnLoading";
import VirtualisedRow from "./VirtualisedRow";
import { isFirstFileExplorerItemInColumnEqualTo } from "@renderer/utilities/isFirstFileExplorerItemInColumnEqualTo";
import { selectColumn } from "@renderer/store/selectors/selectColumn";
import { selectActiveColumnIndex } from "@renderer/store/selectors/selectColumnIndex";
import { selectRowIndexElseNegativeOne } from "@renderer/store/selectors/selectRowIndex";

const rem = 16;
const VIRTUALISED_ROW_PADDING = 5;

VirtualisedColumn.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

function VirtualisedColumn({ columnIndex }): JSX.Element {
  const fixedSizeListRef = useRef<FixedSizeList | null>(null);

  const column = useAppSelector((state) => selectColumn(state, columnIndex));

  const activeColumnIndex = useAppSelector(selectActiveColumnIndex);

  const selectedRowIndex = useAppSelector((state) =>
    selectRowIndexElseNegativeOne(state, columnIndex)
  );

  const scrollSelectedItemIntoView = useCallback(() => {
    if (fixedSizeListRef.current === null) {
      return;
    }

    if (selectedRowIndex > -1) {
      fixedSizeListRef.current.scrollToItem(selectedRowIndex);
    }
  }, [selectedRowIndex]);

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
    if (activeColumnIndex === columnIndex) {
      scrollSelectedItemIntoView();
    }
  }, [scrollSelectedItemIntoView, activeColumnIndex, columnIndex]);

  if (column.length === 0) {
    return <ColumnEmptyFolder columnIndex={columnIndex} />;
  } else if (
    isFirstFileExplorerItemInColumnEqualTo(column, SPECIAL_FILE_EXPLORER_ITEM_FILE_DETAILS)
  ) {
    return <ColumnFileInfo />;
  } else if (isFirstFileExplorerItemInColumnEqualTo(column, SPECIAL_FILE_EXPLORER_ITEM_BLANK)) {
    return <ColumnBlank columnIndex={columnIndex} />;
  } else if (isFirstFileExplorerItemInColumnEqualTo(column, SPECIAL_FILE_EXPLORER_ITEM_LOADING)) {
    return <ColumnLoading />;
  } else {
    return (
      <AutoSizer>
        {(props): JSX.Element => (
          <FixedSizeList
            ref={fixedSizeListRef}
            style={{
              overflowY: "scroll"
            }}
            // eslint-disable-next-line react/prop-types
            height={props.height as number}
            // eslint-disable-next-line react/prop-types
            width={props.width as number}
            itemCount={column.length}
            itemData={columnIndex}
            itemSize={rem + 2 * VIRTUALISED_ROW_PADDING}
            itemKey={(index_rowIndex, data_columnIndex): React.Key => {
              const fileExplorerItem = column[index_rowIndex];
              return fileExplorerItem.displayName;
            }}
          >
            {VirtualisedRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    );
  }
}

export default React.memo(VirtualisedColumn);
