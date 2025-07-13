"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HamburgerIcon } from "@/components/ui/hamburger-icon"
import { socialLinks, SocialLink } from "@/lib/social-links"
import { ChevronDown } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/10 backdrop-blur-xl border-b border-primary/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24 md:grid md:grid-cols-3">
          
          {/* Desktop Social Media Icons - Left Side */}
          <div className="hidden md:flex items-center space-x-3">
            {socialLinks.map((social: SocialLink, index) => (
              <Link
                key={index}
                href={social.href}
                className="p-2 transition-all duration-150 text-white hover:text-current group"
                aria-label={social.label}
                target={social.href.startsWith('http') ? '_blank' : '_self'}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{
                  '--hover-color': social.hoverColor
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (social.hoverColor) {
                    e.currentTarget.style.color = social.hoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                }}
              >
                <social.icon className="w-6 h-6 transition-all duration-150" />
              </Link>
            ))}
          </div>

          {/* Logo - Center */}
          <div className="flex justify-center">
            <button
              onClick={scrollToTop}
              className="relative transition-all duration-150 group focus:outline-none focus:ring-0 focus:ring-primary/20"
              aria-label="Scroll to top"
            >
              <Image
                src="/Derpcat.svg"
                alt="Derpcat Artist Logo"
                width={60}
                height={60}
                priority
                className="object-contain filter invert group-hover:filter-none transition-filter duration-150"
              />
            </button>
          </div>

          {/* Desktop Navigation Links - Right Side */}
          <div className="hidden md:flex items-center justify-end space-x-6">
            <Link
              href="#tours"
              className="text-white hover:text-primary transition-colors duration-150 font-bold text-lg tracking-wide"
            >
              TOURS
            </Link>
            <Link
              href="#about"
              className="text-white hover:text-primary transition-colors duration-150 font-bold text-lg tracking-wide"
            >
              ABOUT
            </Link>
            <Link
              href="https://shop.derpcatmusic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors duration-150 font-bold text-lg tracking-wide"
            >
              SHOP
            </Link>
            
            {/* Desktop Dropdown Menu */}
            <div className="relative group h-full">
              <button className="h-full bg-[#0a0a0a] text-white font-bold text-lg tracking-wide px-6 flex items-center focus:outline-none select-none w-[160px] justify-center">
                Book Me
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              
              {/* Dropdown Content */}
              <div className="absolute top-full left-0 mt-0 bg-[#0a0a0a] shadow-2xl text-white w-[160px] p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full cursor-pointer font-medium hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 px-3 py-3 rounded-md text-left"
                >
                  Book a Show
                </Link>
                <Link
                  href="#book"
                  className="block w-full cursor-pointer font-medium hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 px-3 py-3 rounded-md text-left"
                >
                  Book a Lesson
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button - Right Side */}
          <div className="md:hidden flex items-center justify-end">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white/80 focus:text-white/80 hover:bg-transparent h-12 w-12 flex items-center justify-center focus:outline-none focus:ring-0"
                >
                  <HamburgerIcon isOpen={isOpen} className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="bg-[#0a0a0a] border-primary/20">
                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>

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
                  }
                `}</style>

                <div className="flex flex-col space-y-8 mt-8">
                  {/* Mobile Navigation Links */}
                  <Link
                    href="#tours"
                    className="text-white hover:text-primary transition-colors duration-150 font-bold text-xl tracking-wide"
                    onClick={closeMenu}
                  >
                    TOURS
                  </Link>
                  <Link
                    href="#about"
                    className="text-white hover:text-primary transition-colors duration-150 font-bold text-xl tracking-wide"
                    onClick={closeMenu}
                  >
                    ABOUT
                  </Link>
                  <Link
                    href="https://shop.derpcatmusic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors duration-150 font-bold text-xl tracking-wide"
                    onClick={closeMenu}
                  >
                    SHOP
                  </Link>
                  
                  {/* Mobile Book Me Options */}
                  <div className="flex flex-col space-y-4">
                    <div className="text-white font-bold text-xl tracking-wide mb-2">BOOK ME</div>
                    <Link
                      href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 text-white font-medium py-3 px-4 w-fit transition-all duration-200 text-center rounded-lg flex items-center"
                      onClick={closeMenu}
                    >
                      <span className="text-red-400 mr-2">🎵</span>
                      Book a Show
                    </Link>
                    <Link
                      href="#book"
                      className="bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 text-white font-medium py-3 px-4 w-fit transition-all duration-200 text-center rounded-lg flex items-center"
                      onClick={closeMenu}
                    >
                      <span className="text-red-400 mr-2">📚</span>
                      Book a Lesson
                    </Link>
                  </div>

                  {/* Mobile Social Links */}
                  <div className="flex flex-wrap justify-around gap-4 pt-4 border-t border-primary/20">
                    {socialLinks.map((social: SocialLink, index) => (
                      <Link
                        key={index}
                        href={social.href}
                        className="p-2 transition-all duration-150 text-white group"
                        aria-label={social.label}
                        target={social.href.startsWith('http') ? '_blank' : '_self'}
                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={closeMenu}
                        onMouseEnter={(e) => {
                          if (social.hoverColor) {
                            e.currentTarget.style.color = social.hoverColor;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '';
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
  )
}