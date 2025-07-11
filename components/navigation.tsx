"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

// Import the socialLinks array and SocialLink type from your new file
import { socialLinks, SocialLink } from "@/lib/social-links"; // Adjust the path if your file is elsewhere, e.g., "../lib/social-links" or "@/constants/social-links"

// REMOVE ALL react-icons IMPORTS FROM HERE, they are now in lib/social-links.ts
// REMOVE the socialLinks array definition from here.

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/10 backdrop-blur-xl border-b border-primary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-20">
          {/* Social Icons - Left Side */}
          <div className="flex items-center justify-start space-x-1">
            <div className="hidden md:flex items-center space-x-1">
              {socialLinks.map((social: SocialLink, index) => ( // Use the SocialLink type here
                <Link
                  key={index}
                  href={social.href}
                  className={`p-2 transition-all duration-150 ${social.color} group`}
                  aria-label={social.label}
                  target={social.href.startsWith('http') ? '_blank' : '_self'}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <social.icon className="w-6 h-6 transition-transform duration-150" />
                </Link>
              ))}
            </div>
          </div>

          {/* Logo - Center */}
          <div className="flex justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="relative p-2 transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Scroll to top"
            >
              <Image
                src="/derpcat.svg"
                alt="Derpcat Artist Logo"
                width={60}
                height={60}
                priority
                className="object-contain filter invert group-hover:filter-none transition-filter duration-150"
              />
            </button>
          </div>

          {/* Navigation Links - Right Side */}
          <div className="flex items-center justify-end space-x-6">
            <div className="hidden md:flex items-center space-x-6">
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
                href="https://store.derpcatmusic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors duration-150 font-bold text-lg tracking-wide"
              >
                MERCH
              </Link>
              <Button
                asChild
                className="bg-primary hover:bg-transparent hover:border-2 hover:border-primary text-white font-medium px-6 py-2 transition-all duration-150 hover:shadow-lg hover:shadow-primary/25"
              >
                <Link href="#book">Book Me</Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-primary">
                  <Menu className="h-10 w-10" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-primary/20">
                <div className="flex flex-col space-y-8 mt-8">
                  <Link
                    href="#tours"
                    className="text-white hover:text-primary transition-colors duration-150 font-bold text-xl tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    TOURS
                  </Link>
                  <Link
                    href="#about"
                    className="text-white hover:text-primary transition-colors duration-150 font-bold text-xl tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    ABOUT
                  </Link>
                  <Link
                    href="https://store.derpcatmusic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors duration-150 font-bold text-xl tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    SHOP
                  </Link>
                  <Button
                    asChild
                    className="bg-primary hover:bg-transparent hover:border-2 hover:border-primary text-white font-medium px-6 py-3 w-fit transition-all duration-150"
                  >
                    <Link href="#book" onClick={() => setIsOpen(false)}>
                      Book Me
                    </Link>
                  </Button>

                  {/* Mobile Social Links */}
                  <div className="flex space-x-4 pt-4 border-t border-primary/20">
                    {socialLinks.map((social: SocialLink, index) => ( // Use the SocialLink type here
                      <Link
                        key={index}
                        href={social.href}
                        className={`p-3 transition-all duration-150 ${social.color}`}
                        aria-label={social.label}
                        target={social.href.startsWith('http') ? '_blank' : '_self'}
                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        <social.icon className="w-6 h-6" />
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