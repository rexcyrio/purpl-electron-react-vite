import { useAppDispatch } from "@renderer/store/hooks";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import ColumnWrapper from "./ColumnWrapper";
import { navigateTo } from "@renderer/store/slices/itemsSlice";

ColumnEmptyFolder.propTypes = {
  columnIndex: PropTypes.number.isRequired
};

function ColumnEmptyFolder({ columnIndex }): JSX.Element {
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(navigateTo(columnIndex, -1));
  }, [dispatch, columnIndex]);

  return (
    <ColumnWrapper>
      <div
        onClick={handleClick}
        style={{
          height: "100%"
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
    </ColumnWrapper>
  );
}

export default React.memo(ColumnEmptyFolder);
