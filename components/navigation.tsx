"use client";

import { useState } from "react";
import FlipLink from "./ui/text-effect-flipper";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BgAnimateButton } from "@/components/ui/bg-animate-button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HamburgerIcon } from "@/components/ui/hamburger-icon";
import { socialLinks, SocialLink } from "@/lib/social-links";
import { ChevronDown } from "lucide-react";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/30">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex justify-between items-center h-28 md:grid md:grid-cols-3">
          {/* Desktop Social Media Icons - Left Side */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((social: SocialLink, index) => (
              <div key={index}>
                <Link
                  href={social.href}
                  className="p-3 transition-all duration-200 text-foreground hover:text-current group hover:scale-110"
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
                  onMouseEnter={(e) => {
                    if (social.hoverColor) {
                      e.currentTarget.style.color = social.hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                  }}
                >
                  <social.icon className="w-8 h-8 transition-all duration-200" />
                </Link>
              </div>
            ))}
          </div>

          {/* Logo - Center */}
          <div className="flex justify-center">
            <button
              onClick={scrollToTop}
              className="relative transition-all duration-200 group focus:outline-none focus:ring-0 focus:ring-primary/20 hover:scale-110"
              aria-label="Scroll to top"
            >
              <Image
                src="/Derpcat.svg"
                alt="Derpcat Artist Logo"
                width={70}
                height={70}
                priority
                className="object-contain dark:filter dark:invert transition-all duration-200 group-hover:scale-110"
              />
            </button>
          </div>

          {/* Desktop Navigation Links - Right Side */}
          <div className="hidden md:flex items-center justify-end space-x-6">
            <div className="flex items-center space-x-6">
              <Link
                href="#tours"
                className="font-title text-xl tracking-wide text-foreground hover:text-primary transition-colors duration-200 uppercase"
              >
                TOURS
              </Link>
              <Link
                href="#about"
                className="font-title text-xl tracking-wide text-foreground hover:text-primary transition-colors duration-200 uppercase"
              >
                ABOUT
              </Link>
              <Link
                href="https://shop.derpcatmusic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-title text-xl tracking-wide text-foreground hover:text-primary transition-colors duration-200 uppercase"
              >
                SHOP
              </Link>
            </div>

            <ThemeToggleButton variant="circle-blur" start="top-left" />

            {/* Desktop Beautiful Book Me Button */}
            <div className="relative group">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-title text-lg tracking-wide px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <div className="flex items-center">
                  Book Me
                  <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
                </div>
              </button>

              {/* Enhanced Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 bg-card/95 backdrop-blur-xl shadow-2xl border border-primary/20 text-card-foreground w-[200px] p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-xl">
                <div>
                  <Link
                    href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full cursor-pointer font-body hover:bg-primary/20 hover:text-primary transition-all duration-200 px-4 py-3 rounded-lg text-left group/item"
                  >
                    <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform duration-200">
                      🎵
                    </span>
                    <span className="text-base">Book a Show</span>
                  </Link>
                </div>

                <div>
                  <Link
                    href="#book"
                    className="flex items-center w-full cursor-pointer font-body hover:bg-primary/20 hover:text-primary transition-all duration-200 px-4 py-3 rounded-lg text-left group/item"
                  >
                    <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform duration-200">
                      📚
                    </span>
                    <span className="text-base">Book a Lesson</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button - Right Side */}
          <div className="md:hidden flex items-center justify-end space-x-3">
            <div>
              <ThemeToggleButton variant="circle-blur" start="top-left" />
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <div>
                  <Button
                    variant="ghost"
                    className="text-foreground hover:text-foreground/80 focus:text-foreground/80 hover:bg-transparent h-14 w-14 flex items-center justify-center focus:outline-none focus:ring-0"
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
                className="bg-background border-border w-[300px] sm:w-[400px]"
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

                <div className="flex flex-col space-y-8 mt-8">
                  {/* Mobile Navigation Links */}
                  <Link
                    href="#tours"
                    className="text-foreground hover:text-primary transition-colors duration-150 font-title text-lg tracking-wide"
                    onClick={closeMenu}
                  >
                    TOURS
                  </Link>
                  <Link
                    href="#about"
                    className="text-foreground hover:text-primary transition-colors duration-150 font-title text-lg tracking-wide"
                    onClick={closeMenu}
                  >
                    ABOUT
                  </Link>
                  <Link
                    href="https://shop.derpcatmusic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors duration-150 font-title text-lg tracking-wide"
                    onClick={closeMenu}
                  >
                    SHOP
                  </Link>

                  {/* Mobile Book Me Options */}
                  <div className="flex flex-col space-y-4">
                    <div className="text-foreground font-title text-xl tracking-wide mb-2">
                      BOOK ME
                    </div>
                    <Link
                      href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/20 border-2 border-primary hover:bg-primary/30 text-foreground font-body py-3 px-4 w-fit transition-all duration-200 text-center rounded-lg flex items-center"
                      onClick={closeMenu}
                    >
                      <span className="text-primary mr-2">🎵</span>
                      Book a Show
                    </Link>
                    <Link
                      href="#book"
                      className="bg-primary/20 border-2 border-primary hover:bg-primary/30 text-foreground font-body py-3 px-4 w-fit transition-all duration-200 text-center rounded-lg flex items-center"
                      onClick={closeMenu}
                    >
                      <span className="text-primary mr-2">📚</span>
                      Book a Lesson
                    </Link>
                  </div>

                  {/* Mobile Theme Toggle */}
                  <div className="flex justify-center pt-4 border-t border-border">
                    <ThemeToggleButton variant="circle-blur" start="center" />
                  </div>

                  {/* Mobile Social Links */}
                  <div className="flex flex-wrap justify-around gap-4 pt-4 border-t border-border">
                    {socialLinks.map((social: SocialLink, index) => (
                      <Link
                        key={index}
                        href={social.href}
                        className="p-2 transition-all duration-150 text-foreground group"
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
                        onMouseEnter={(e) => {
                          if (social.hoverColor) {
                            e.currentTarget.style.color = social.hoverColor;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "";
                        }}
                      >
                        <social.icon className="w-6 h-6 transition-all duration-150" />
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
