import React from "react";
import ButtonCreateNewFolder from "./ButtonCreateNewFolder";
import ButtonHelpWindow from "./ButtonHelpWindow";
import ButtonOpenInFileExplorer from "./ButtonOpenInFileExplorer";

function Topbar() {
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
    </div>
  );
}

export default React.memo(Topbar);
