import { getIconType } from "@renderer/utilities/getIconType";
import type * as CSS from "csstype";
import PropTypes from "prop-types";
import React from "react";
import { FiHardDrive } from "react-icons/fi";
import {
  IoIosDesktop,
  IoIosDocument,
  IoIosDownload,
  IoIosFilm,
  IoIosFolder,
  IoIosImage,
  IoIosMusicalNotes
} from "react-icons/io";

SidebarRowIcon.propTypes = {
  fullPath: PropTypes.string.isRequired,
  heightWidth: PropTypes.string.isRequired
};

function SidebarRowIcon({ fullPath, heightWidth }): JSX.Element {
  const _iconType = getIconType(fullPath);
  const _style: CSS.Properties = {
    height: heightWidth,
    width: heightWidth,
    opacity: 0.7,
    flexShrink: 0
  };

  switch (_iconType) {
    case "Desktop":
      return <IoIosDesktop style={_style} />;
    case "Documents":
      return <IoIosDocument style={_style} />;
    case "Downloads":
      return <IoIosDownload style={_style} />;
    case "Music":
      return <IoIosMusicalNotes style={_style} />;
    case "Pictures":
      return <IoIosImage style={_style} />;
    case "Videos":
      return <IoIosFilm style={_style} />;
    case "Other":
      return <IoIosFolder style={_style} />;
    case "Drive":
      return <FiHardDrive style={_style} />;
  }
}

export default React.memo(SidebarRowIcon);
