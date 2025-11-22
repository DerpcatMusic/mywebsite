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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { name: "TOURS", href: "/#tours" },
  { name: "ABOUT", href: "/#about" },
  { name: "SHOP", href: "/#shop" },
  { name: "LIVE", href: "/live" },
  { name: "BOOK ME", href: "/#book", isPrimary: true },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "+=100",
          scrub: 0.5, // Add smoothing
        },
      });

      // Transform to Dock Mode
      tl.to(navRef.current, {
        y: 20,
        width: "auto",
        padding: "0.5rem 1.5rem",
        borderRadius: "9999px",
        backgroundColor: "rgba(var(--background-rgb), 0.8)", // More opaque for tinted glass
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        duration: 0.5,
        ease: "power2.inOut",
      });

      // Animate Logo
      tl.to(
        logoRef.current,
        {
          scale: 0.8,
          duration: 0.5,
        },
        "<"
      );

      // Stagger Links Entrance
      gsap.from(".nav-link", {
        y: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });
    },
    { scope: navRef }
  );

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.1,
      duration: 0.3,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const handleHoverExit = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center">
      <nav
        ref={navRef}
        className="pointer-events-auto relative z-50 flex w-full items-center justify-between bg-background/95 backdrop-blur-sm px-6 py-4 text-foreground shadow-sm transition-all"
      >
        {/* Logo */}
        <div ref={logoRef} className="flex items-center">
          <Link href="/" className="relative block">
            <Image
              src="/Derpcat.svg"
              alt="Derpcat Artist Logo"
              width={60}
              height={60}
              priority
              className="object-contain dark:invert dark:filter"
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <div ref={linksRef} className="hidden items-center space-x-8 md:flex">
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link font-pixel text-sm uppercase tracking-wider transition-colors ${item.isPrimary
                ? "text-foreground hover:text-primary"
                : "text-foreground/80 hover:text-primary"
                }`}
              onMouseEnter={handleHover}
              onMouseLeave={handleHoverExit}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-l border-white/10 pl-4">
            <ThemeToggleButton variant="circle-blur" start="top-left" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggleButton variant="circle-blur" start="top-left" />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 p-0">
                <HamburgerIcon
                  isOpen={isOpen}
                  className="h-6 w-6 text-foreground"
                />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l-2 border-white bg-black text-white"
            >
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <div className="mt-12 flex flex-col space-y-8">
                {navItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-pixel text-xl uppercase ${item.isPrimary
                      ? "text-primary"
                      : "text-white hover:text-primary"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-wrap justify-center gap-6 border-t border-white/20 pt-8">
                  {socialLinks.map((social: SocialLink, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className="text-white/60 transition-colors hover:text-primary"
                      target={
                        social.href.startsWith("http") ? "_blank" : "_self"
                      }
                    >
                      <social.icon className="h-6 w-6" />
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
