import { useAppDispatch, useAppSelector } from "@renderer/store/hooks";
import { selectNumberOfNonBlankColumns } from "@renderer/store/selectors/selectNumberOfNonBlankColumns";
import { removeColumnsToTheRightOf } from "@renderer/store/slices/fileExplorerItemsSlice";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

ColumnBlank.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

function ColumnBlank({ columnIndex }): JSX.Element {
  const dispatch = useAppDispatch();
  const columnBlankRef = useRef<HTMLDivElement | null>(null);
  const numNonBlankColumns = useAppSelector(selectNumberOfNonBlankColumns);

  useEffect(() => {
    if (columnBlankRef.current === null) {
      return;
    }

    const rect = columnBlankRef.current.getBoundingClientRect();
    const windowInnerWidth = window.innerWidth;

    if (rect.left > windowInnerWidth) {
      dispatch(removeColumnsToTheRightOf(columnIndex));
    }
  }, [dispatch, numNonBlankColumns, columnIndex]);

  return (
    <div
      ref={columnBlankRef}
      style={{
        height: "100%"
      }}
    >
      &nbsp;
    </div>
  );
}

export default React.memo(ColumnBlank);
