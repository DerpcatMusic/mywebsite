import { IconType } from 'react-icons';
import { FaInstagram, FaTiktok, FaYoutube, FaSpotify } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';

// Define a type for your social link objects for better type safety
export type SocialLink = {
  icon: IconType; // IconType comes from react-icons and represents a React component
  href: string;
  label: string;
  hoverColor?: string; // Optional: Use hoverColor for inline style on hover
};

// This array now holds all your social media data
export const socialLinks: SocialLink[] = [
  { 
    icon: FaInstagram, 
    href: "https://www.instagram.com/derpcat_music", 
    label: "Instagram", 
    hoverColor: "#dc2743" // Instagram solid color for now
  },
  { 
    icon: FaTiktok, 
    href: "https://www.tiktok.com/@imderpcat", 
    label: "TikTok", 
    hoverColor: "#69C9D0"
  },
  { 
    icon: FaYoutube, 
    href: "https://www.youtube.com/@Derpcat", 
    label: "YouTube", 
    hoverColor: "#FF0000"
  },
  { 
    icon: FaSpotify, 
    href: "https://open.spotify.com/artist/3o8xPY8Zencrdc3RtvVaQM?si=4075d2460d2242c2", 
    label: "Spotify", 
    hoverColor: "#1DB954"
  },
  { 
    icon: SiApplemusic, 
    href: "https://music.apple.com/gb/artist/derpcat/1368112944", 
    label: "Apple Music", 
    hoverColor: "#FC3A55"
  },
];