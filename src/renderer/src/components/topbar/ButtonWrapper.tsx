import React from "react";

interface ButtonWrapperProps {
  children: React.ReactNode;
}

export default function ButtonWrapper({ children }: ButtonWrapperProps) {
  return (
    <div
      style={{
        padding: "0.25rem"
      }}
    >
      {children}
    </div>
  );
}
