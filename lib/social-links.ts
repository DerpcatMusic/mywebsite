import { IconType } from 'react-icons';
import { FaInstagram, FaTiktok, FaYoutube, FaSpotify } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';

// Define a type for your social link objects for better type safety
export type SocialLink = {
  icon: IconType; // IconType comes from react-icons and represents a React component
  href: string;
  label: string;
  color: string; // Tailwind CSS class for hover color
};

// This array now holds all your social media data
export const socialLinks: SocialLink[] = [
  { 
    icon: FaInstagram, 
    href: "https://www.instagram.com/derpcat_music", 
    label: "Instagram", 
    color: "hover:text-pink-400" 
  },
  { 
    icon: FaTiktok, 
    href: "https://www.tiktok.com/@imderpcat", 
    label: "TikTok", 
    color: "hover:text-fuchsia-500" // Or your custom color like "hover:text-tiktokPink"
  },
  { 
    icon: FaYoutube, 
    href: "https://www.youtube.com/@Derpcat", 
    label: "YouTube", 
    color: "hover:text-red-500" 
  },
  { 
    icon: FaSpotify, 
    href: "https://open.spotify.com/artist/3o8xPY8Zencrdc3RtvVaQM?si=4075d2460d2242c2", 
    label: "Spotify", 
    color: "hover:text-green-400" 
  },
  { 
    icon: SiApplemusic, 
    href: "https://music.apple.com/gb/artist/derpcat/1368112944", 
    label: "Apple Music", 
    color: "hover:text-blue-400" 
  },
];