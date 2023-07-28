import type * as CSS from "csstype";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

MemoFileIcon.propTypes = {
  filePath: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "large"]).isRequired
};

function MemoFileIcon({ filePath, size }): JSX.Element {
  const [imageSource, setImageSource] = useState(
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  );

  useEffect(() => {
    window.api.getIcon(filePath).then((dataUrl) => setImageSource(dataUrl));
  }, [filePath]);

  return (
    <img
      src={imageSource}
      style={size === "small" ? smallStyle : largeStyle}
      alt={`Icon of ${filePath}`}
    />
  );
}

const smallStyle: CSS.Properties = {
  height: "1.25rem",
  width: "1.25rem",
  margin: "0 0.125rem"
};

const largeStyle: CSS.Properties = {
  height: "5rem",
  width: "5rem"
};

export default React.memo(MemoFileIcon);
