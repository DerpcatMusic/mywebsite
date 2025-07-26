"use client";

import * as React from "react";

interface HamburgerIconProps extends React.SVGProps<SVGSVGElement> {
  isOpen?: boolean;
}

const HamburgerIcon = ({
  isOpen = false,
  className,
  ..._props
}: HamburgerIconProps & { className?: string }) => {
  return (
    <div
      className={`relative flex transform items-center justify-center transition-all duration-200 ${className}`}
    >
      <div className="flex h-full w-full transform flex-col items-center justify-center overflow-hidden transition-all duration-300">
        <span
          className={`relative block h-0.5 w-7 transform rounded-sm bg-current transition-all duration-300 ease-in-out ${isOpen ? "translate-y-1.5 rotate-45" : "-translate-y-2"}`}
        ></span>
        <span
          className={`relative block h-0.5 w-7 transform rounded-sm bg-current transition-all duration-300 ease-in-out ${isOpen ? "rotate-[-45deg]" : ""}`}
        ></span>
        <span
          className={`relative block h-0.5 w-7 transform rounded-sm bg-current transition-all duration-300 ease-in-out ${isOpen ? "-translate-y-1.5 -rotate-45" : "translate-y-2"}`}
        ></span>
      </div>
    </div>
  );
};

export { HamburgerIcon };
