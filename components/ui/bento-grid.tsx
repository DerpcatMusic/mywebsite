import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-8 md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group/bento hover:animate-morph row-span-1 flex cursor-pointer flex-col justify-between space-y-4 border-4 border-foreground bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_0px_rgba(var(--primary),1)]",
        className
      )}
    >
      {header}
      <div className="transition duration-300">
        {icon}
        <div className="mb-2 mt-4 font-heading text-3xl font-black uppercase tracking-widest text-primary">
          {title}
        </div>
        <div className="font-terminal text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
};
