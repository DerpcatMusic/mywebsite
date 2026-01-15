"use client";

import { Button } from "@/components/ui/button";
import { HamburgerIcon } from "@/components/ui/hamburger-icon";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { socialLinks } from "@/lib/social-links";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { name: "Music", href: "/#release" },
  { name: "Merch", href: "/#shop" },
  { name: "Tour", href: "/#tours" },
  { name: "Contact", href: "/#book" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-8 z-[100] flex justify-center px-6">
      <nav className="glass-header pointer-events-auto flex w-full max-w-3xl items-center justify-between rounded-full px-10 py-5 transition-all duration-700 hover:scale-[1.01] hover:bg-background/40">
        {/* Logo Text - Elegant Dotted */}
        <Link
          href="/"
          className="font-pixel text-3xl font-normal tracking-tighter text-white transition-colors hover:text-white/70"
        >
          DERPCAT
        </Link>

        {/* Desktop Links - Elegant Smooth */}
        <div className="hidden items-center gap-10 font-sans text-[10px] font-black uppercase tracking-[0.4em] text-white/40 md:flex">
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 transition-transform hover:bg-transparent active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
              >
                <HamburgerIcon isOpen={isOpen} className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="h-[100dvh] w-full border-b-0 bg-background/95 px-12 pt-40 backdrop-blur-3xl sm:h-auto sm:border-b"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col items-start space-y-12">
                {navItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="font-pixel text-6xl font-normal tracking-tight text-white/90 transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex justify-start gap-10 pt-16 opacity-40 grayscale">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className="text-white transition-all hover:scale-110"
                      target={
                        social.href.startsWith("http") ? "_blank" : "_self"
                      }
                    >
                      <social.icon className="h-5 w-5" />
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
