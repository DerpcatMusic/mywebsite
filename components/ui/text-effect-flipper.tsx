import React from "react";
import { motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER = 0.025;

interface FlipLinkProps {
  children: string;
  href: string;
}

const FlipLink: React.FC<FlipLinkProps> = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      {...(href.startsWith("http") && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      href={href}
      className="relative inline-flex font-title text-2xl uppercase nav-text hover:text-primary tracking-wide transition-colors duration-200"
      style={{
        lineHeight: 1,
        padding: "0.5rem 0.75rem",
      }}
    >
      {children.split("").map((letter, i) => (
        <div
          key={i}
          className="relative inline-block"
          style={{
            height: "1.2em",
            overflow: "hidden",
            width: letter === " " ? "0.5em" : "auto",
            minWidth: letter === " " ? "0.5em" : "0.6em",
          }}
        >
          {/* First instance - visible initially, moves up on hover */}
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-120%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              height: "1.2em",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>

          {/* Second instance - starts below, moves to center on hover */}
          <motion.span
            variants={{
              initial: {
                y: "120%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              height: "1.2em",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </div>
      ))}
    </motion.a>
  );
};

export default FlipLink;
