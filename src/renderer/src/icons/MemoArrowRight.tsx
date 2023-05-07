import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import React from "react";

function MemoArrowRight(): JSX.Element {
  return (
    <ArrowRightIcon
      sx={{
        color: "#ababab"
      }}
    />
  );
}

export default React.memo(MemoArrowRight);
