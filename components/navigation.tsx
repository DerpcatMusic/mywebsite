"use client";

import { Button } from "@/components/ui/button";
import { HamburgerIcon } from "@/components/ui/hamburger-icon";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { SocialLink, socialLinks } from "@/lib/social-links";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import FlipLink from "./ui/text-effect-flipper";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-background/90 backdrop-blur-xl">
      {/* Global transparency mask - fully transparent at bottom, no border */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 via-background/60 to-transparent pointer-events-none" />
      <div className="container mx-auto max-w-full px-4 relative">
        <div className="flex h-28 items-center justify-between md:grid md:grid-cols-3">
          {/* Desktop Social Media Icons - Left Side */}
          <div className="hidden items-center space-x-4 md:flex">
            {socialLinks.map((social: SocialLink, index) => (
              <div key={index}>
                <Link
                  href={social.href}
                  className="group p-3 text-foreground transition-all duration-300 hover:scale-110 hover:text-current"
                  aria-label={social.label}
                  target={social.href.startsWith("http") ? "_blank" : "_self"}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  style={
                    {
                      "--hover-color": social.hoverColor,
                    } as React.CSSProperties
                  }
                  onMouseEnter={e => {
                    if (social.hoverColor) {
                      e.currentTarget.style.color = social.hoverColor;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "";
                  }}
                >
                  <social.icon className="h-8 w-8 transition-all duration-200" />
                </Link>
              </div>
            ))}
          </div>

          {/* Logo - Center */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="group relative transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-0 focus:ring-primary/20"
              aria-label="Go to home page"
            >
              <Image
                src="/Derpcat.svg"
                alt="Derpcat Artist Logo"
                width={70}
                height={70}
                priority
                className="object-contain transition-all duration-200 group-hover:scale-110 dark:invert dark:filter"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links - Right Side */}
          <div className="hidden items-center justify-end space-x-6 md:flex">
            <div className="flex items-center space-x-6">
              <FlipLink href="/#tours">TOURS</FlipLink>
              <FlipLink href="/#about">ABOUT</FlipLink>
              <FlipLink href="/#shop">SHOP</FlipLink>
              <FlipLink href="/live">LIVE</FlipLink>
            </div>

            <ThemeToggleButton variant="circle-blur" start="top-left" />

            {/* Desktop Beautiful Book Me Button */}
            <div className="group relative">
              <button className="btn-text rounded-xl bg-primary px-8 py-4 font-title text-lg tracking-wide shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-xl">
                <div className="flex items-center">
                  Book Me
                  <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
                </div>
              </button>

              {/* Enhanced Dropdown Content */}
              <div className="invisible absolute left-0 top-full z-50 mt-2 w-[200px] rounded-xl border border-primary/20 bg-card/95 p-3 text-card-foreground opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <div>
                  <Link
                    href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-text group/item flex w-full cursor-pointer items-center rounded-lg px-4 py-3 text-left font-body transition-all duration-200 hover:bg-primary/20 hover:text-primary"
                  >
                    <span className="mr-3 text-2xl transition-transform duration-200 group-hover/item:scale-110">
                      🎵
                    </span>
                    <span className="text-base">Book a Show</span>
                  </Link>
                </div>

                <div>
                  <Link
                    href="#book"
                    className="nav-text group/item flex w-full cursor-pointer items-center rounded-lg px-4 py-3 text-left font-body transition-all duration-200 hover:bg-primary/20 hover:text-primary"
                  >
                    <span className="mr-3 text-2xl transition-transform duration-200 group-hover/item:scale-110">
                      📚
                    </span>
                    <span className="text-base">Book a Lesson</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button - Right Side */}
          <div className="flex items-center justify-end space-x-3 md:hidden">
            <div>
              <ThemeToggleButton variant="circle-blur" start="top-left" />
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <div>
                  <Button
                    variant="ghost"
                    className="flex h-14 w-14 items-center justify-center text-foreground hover:bg-transparent hover:text-foreground/80 focus:text-foreground/80 focus:outline-none focus:ring-0"
                  >
                    <HamburgerIcon
                      isOpen={isOpen}
                      className="h-7 w-7 text-foreground"
                    />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </div>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] border-border bg-background sm:w-[400px]"
              >
                <SheetTitle className="sr-only">
                  Mobile Navigation Menu
                </SheetTitle>

                <style jsx global>{`
                  .sheet-content > button[type="button"] {
                    width: 40px;
                    height: 40px;
                    right: 1rem;
                    top: 1rem;
                    background: none;
                    border: none;
                    opacity: 1;
                  }
                  .sheet-content > button[type="button"]:focus,
                  .sheet-content > button[type="button"]:active {
                    outline: none;
                    box-shadow: none;
                  }
                  .sheet-content svg.lucide {
                    width: 24px;
                    height: 24px;
                    color: hsl(var(--foreground));
                  }
                `}</style>

                <div className="mt-8 flex flex-col space-y-8">
                  {/* Mobile Navigation Links */}
                  <Link
                    href="/#tours"
                    className="nav-text font-title text-lg tracking-wide transition-colors duration-150 hover:text-primary"
                    onClick={closeMenu}
                  >
                    TOURS
                  </Link>
                  <Link
                    href="/#about"
                    className="nav-text font-title text-lg tracking-wide transition-colors duration-150 hover:text-primary"
                    onClick={closeMenu}
                  >
                    ABOUT
                  </Link>
                  <Link
                    href="/#shop"
                    className="nav-text font-title text-lg tracking-wide transition-colors duration-150 hover:text-primary"
                    onClick={closeMenu}
                  >
                    SHOP
                  </Link>
                  <Link
                    href="/live"
                    className="nav-text font-title text-lg tracking-wide transition-colors duration-150 hover:text-primary"
                    onClick={closeMenu}
                  >
                    LIVE
                  </Link>

                  {/* Mobile Book Me Options */}
                  <div className="flex flex-col space-y-4">
                    <div className="nav-text mb-2 font-title text-xl tracking-wide">
                      BOOK ME
                    </div>
                    <Link
                      href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-text flex w-fit items-center rounded-lg border-2 border-primary bg-primary/20 px-4 py-3 text-center font-body transition-all duration-200 hover:bg-primary/30"
                      onClick={closeMenu}
                    >
                      <span className="mr-2 text-primary">🎵</span>
                      Book a Show
                    </Link>
                    <Link
                      href="#book"
                      className="nav-text flex w-fit items-center rounded-lg border-2 border-primary bg-primary/20 px-4 py-3 text-center font-body transition-all duration-200 hover:bg-primary/30"
                      onClick={closeMenu}
                    >
                      <span className="mr-2 text-primary">📚</span>
                      Book a Lesson
                    </Link>
                  </div>

                  {/* Mobile Theme Toggle */}
                  <div className="flex justify-center border-t border-border pt-4">
                    <ThemeToggleButton variant="circle-blur" start="center" />
                  </div>

                  {/* Mobile Social Links */}
                  <div className="flex flex-wrap justify-around gap-4 border-t border-border pt-4">
                    {socialLinks.map((social: SocialLink, index) => (
                      <Link
                        key={index}
                        href={social.href}
                        className="nav-text group p-2 transition-all duration-150"
                        aria-label={social.label}
                        target={
                          social.href.startsWith("http") ? "_blank" : "_self"
                        }
                        rel={
                          social.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        onClick={closeMenu}
                        onMouseEnter={e => {
                          if (social.hoverColor) {
                            e.currentTarget.style.color = social.hoverColor;
                          }
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = "";
                        }}
                      >
                        <social.icon className="h-6 w-6 transition-all duration-150" />
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
