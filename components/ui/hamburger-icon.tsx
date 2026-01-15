"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface HamburgerIconProps extends React.SVGProps<SVGSVGElement> {
  isOpen?: boolean;
}

const HamburgerIcon = ({
  isOpen,
  className,
  ...props
}: HamburgerIconProps) => {
  return (
    <div
      className={cn(
        "relative flex h-6 w-6 transform items-center justify-center transition-all duration-300",
        className
      )}
    >
      <div
        className={cn(
          "absolute h-[2px] w-6 transform bg-current transition-all duration-300",
          isOpen ? "rotate-45" : "-translate-y-1.5"
        )}
      />
      <div
        className={cn(
          "absolute h-[2px] w-6 transform bg-current transition-all duration-300",
          isOpen ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        className={cn(
          "absolute h-[2px] w-6 transform bg-current transition-all duration-300",
          isOpen ? "-rotate-45" : "translate-y-1.5"
        )}
      />
    </div>
  );
};

export { HamburgerIcon };
