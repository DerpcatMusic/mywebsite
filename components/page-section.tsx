"use client";

import React from "react";

export default function PageSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative flex min-h-screen w-full flex-col justify-center overflow-hidden ${className}`}
    >
      <div className="flex h-full w-full flex-col justify-center">
        {children}
      </div>
    </section>
  );
}
