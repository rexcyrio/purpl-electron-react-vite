import { useAppDispatch } from "@renderer/store/hooks";
import { navigateTo } from "@renderer/store/slices/fileExplorerItemsSlice";
import PropTypes from "prop-types";
import React, { useCallback } from "react";

ColumnEmptyFolder.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

function ColumnEmptyFolder({ columnIndex }): JSX.Element {
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(navigateTo(columnIndex, -1));
  }, [dispatch, columnIndex]);

  return (
    <div
      onClick={handleClick}
      style={{
        height: "100%",
        overflowY: "scroll"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontStyle: "italic",
          color: "grey",
          cursor: "default"
        }}
      >
        This folder is empty
      </div>
    </div>
  );
}

export default React.memo(ColumnEmptyFolder);
