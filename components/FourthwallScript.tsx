"use client";

import Script from "next/script";

export default function FourthwallScript() {
  return (
    <Script
      src="https://cdn.fourthwall.com/embed/v1/embed.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("Fourthwall script loaded");
      }}
    />
  );
}
