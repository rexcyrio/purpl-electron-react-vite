import Divider from "@mui/material/Divider";
import React from "react";
import ButtonCreateNewFolder from "./ButtonCreateNewFolder";
import ButtonHelpWindow from "./ButtonHelpWindow";
import ButtonOpenInFileExplorer from "./ButtonOpenInFileExplorer";
import ButtonQuickLook from "./ButtonQuickLook";
import ButtonSettings from "./ButtonSettings";

function Topbar(): JSX.Element {
  return (
    <div
      className="top-bar"
      style={{
        display: "flex"
      }}
    >
      <ButtonHelpWindow />
      <ButtonOpenInFileExplorer />
      <ButtonCreateNewFolder />
      <ButtonSettings />
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        style={{
          marginLeft: "0.25rem",
          marginRight: "0.25rem"
        }}
      />
      <ButtonQuickLook />
    </div>
  );
}

export default React.memo(Topbar);
