import PropTypes from "prop-types";
import React from "react";
import {
  FaCss3,
  FaFile,
  FaFileArchive,
  FaFileAudio,
  FaFileCsv,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
  FaHtml5,
  FaJsSquare,
  FaMarkdown
} from "react-icons/fa";

MemoFileIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
  // fileExtension: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "large"]).isRequired
};

function MemoFileIcon({ isActive, size }): JSX.Element {
  return <FaFileArchive />;

  const style = {
    height: size === "small" ? "1.25rem" : "5rem",
    width: size === "small" ? "1.25rem" : "5rem",
    flexShrink: "0"
  };

  switch (fileExtension) {
    case "7z":
    case "gzip":
    case "zip":
      return <FaFileArchive style={{ ...style, color: isActive ? "white" : "grey" }} />;
    case "aac":
    case "flac":
    case "mp3":
    case "m4a":
      return <FaFileAudio style={{ ...style, color: isActive ? "white" : "blueviolet" }} />;
    case "csv":
      return <FaFileCsv style={{ ...style, color: isActive ? "white" : "grey" }} />;
    case "xls":
    case "xlsx":
      return <FaFileExcel style={{ ...style, color: isActive ? "white" : "green" }} />;
    case "jpg":
    case "jpeg":
    case "png":
      return <FaFileImage style={{ ...style, color: isActive ? "white" : "darkturquoise" }} />;
    case "pdf":
      return <FaFilePdf style={{ ...style, color: isActive ? "white" : "crimson" }} />;
    case "ppt":
    case "pptx":
      return <FaFilePowerpoint style={{ ...style, color: isActive ? "white" : "orange" }} />;
    case "mkv":
    case "mp4":
      return <FaFileVideo style={{ ...style, color: isActive ? "white" : "darkorchid" }} />;
    case "doc":
    case "docx":
      return <FaFileWord style={{ ...style, color: isActive ? "white" : "dodgerblue" }} />;

    case "html":
      return <FaHtml5 style={{ ...style, color: isActive ? "white" : "orange" }} />;
    case "css":
      return <FaCss3 style={{ ...style, color: isActive ? "white" : "cornflowerblue" }} />;
    case "js":
      return <FaJsSquare style={{ ...style, color: isActive ? "white" : "gold" }} />;

    case "md":
      return <FaMarkdown style={{ ...style, color: isActive ? "white" : "darkblue" }} />;
    default:
      return <FaFile style={{ ...style, color: isActive ? "white" : "#999999" }} />;
  }
}

export default React.memo(MemoFileIcon);
