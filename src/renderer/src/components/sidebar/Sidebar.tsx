import React from "react";
import SidebarRow from "./SidebarRow";
import SidebarSection from "./SidebarSection";

function Sidebar(): JSX.Element {
  return (
    <div
      className="side-bar"
      style={{
        padding: "0 0.75rem",
        overflowY: "scroll"
      }}
    >
      <div style={{ margin: "0.75rem 0" }}>
        <SidebarSection headerName="Favourites">
          <SidebarRow fullPath="C:\Users\Stefan Lee" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\Desktop" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\Downloads" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\Documents" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\Music" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\Pictures" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\Videos" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\abc" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\one two three four five six seven eight nine ten" />
          <SidebarRow fullPath="C:\Users\Stefan Lee\Documents\Development\purpl-electron-react-vite-2\node_modules\@ampproject\remapping\dist\types\types.d.ts" />
        </SidebarSection>

        <SidebarSection headerName="Drives">
          <SidebarRow fullPath="C:\" />
        </SidebarSection>
      </div>
    </div>
  );
}

export default React.memo(Sidebar);
