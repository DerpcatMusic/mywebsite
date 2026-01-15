"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ClientPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useGSAP(() => {
    // Configure ScrollTrigger to use the main element as the scroller
    // since we have overflow-y: scroll on main for snap scrolling
    ScrollTrigger.defaults({
      scroller: "main",
    });
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="opacity-100">{children}</div>
    </>
  );
}
