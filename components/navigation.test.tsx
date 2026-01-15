import { render, screen } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";
import Navigation from "./navigation";

// Mock GSAP
mock.module("gsap", () => ({
  default: {
    registerPlugin: mock(),
    timeline: () => ({
      to: mock().mockReturnThis(),
      from: mock().mockReturnThis(),
    }),
    to: mock(),
    from: mock(),
  },
  registerPlugin: mock(),
  timeline: () => ({
    to: mock().mockReturnThis(),
    from: mock().mockReturnThis(),
  }),
  to: mock(),
  from: mock(),
}));

// Mock ScrollTrigger
mock.module("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: mock(),
    defaults: mock(),
  },
}));

// Mock @gsap/react
mock.module("@gsap/react", () => ({
  useGSAP: mock(),
}));

// Mock Next.js Image
mock.module("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock Next.js Link
mock.module("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock Framer Motion
mock.module("framer-motion", () => ({
  motion: {
    nav: ({ children, className }: any) => (
      <nav className={className}>{children}</nav>
    ),
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
  useScroll: () => ({
    scrollY: { on: mock(), get: mock().mockReturnValue(0) },
  }),
  useMotionValueEvent: mock(),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("Navigation Component", () => {
  it("renders the logo", () => {
    render(<Navigation />);
    const logo = screen.getByAltText("Derpcat Artist Logo");
    expect(logo).toBeTruthy();
  });

  it("renders desktop links", () => {
    render(<Navigation />);
    expect(screen.getByText("TOURS")).toBeTruthy();
    expect(screen.getByText("ABOUT")).toBeTruthy();
    expect(screen.getByText("SHOP")).toBeTruthy();
    expect(screen.getByText("LIVE")).toBeTruthy();
    expect(screen.getByText("BOOK ME")).toBeTruthy();
  });

  it("renders mobile menu trigger", () => {
    render(<Navigation />);
    // The hamburger icon might not have text, so we look for the button
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
