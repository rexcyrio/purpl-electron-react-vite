import React from "react";

type SidebarSectionProps = React.PropsWithChildren<{
  headerName: string;
}>;

export default function SidebarSection({ headerName, children }: SidebarSectionProps) {
  return (
    <>
      <div
        style={{
          fontSize: "0.9rem",
          color: "gray",
          marginTop: "1.25rem",
          marginBottom: "0.5rem"
        }}
      >
        {headerName}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "start",
          flexDirection: "column",
          gap: "0.5rem"
        }}
      >
        {children}
      </div>
    </>
  );
}
