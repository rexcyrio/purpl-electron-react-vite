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
      </SidebarSection>

      <SidebarSection headerName="Drives">
        <SidebarRow fullPath="C:\" />
      </SidebarSection>
    </div>
  );
}

export default React.memo(Sidebar);
