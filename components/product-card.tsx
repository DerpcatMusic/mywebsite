// components/product-card.tsx - Pokemon-style holographic version
'use client';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import {
  FourthwallProduct,
  getProductImage,
  getProductPrice,
  getProductDescription
} from '../lib/fourthwall';

interface ProductCardProps {
  product: FourthwallProduct;
  fourthwallCheckoutDomain: string | undefined;
  className?: string;
}

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/288x288/1a1a1a/6b46c1?text=No+Image';

// Define colors based on CodePen's :root variables
const DEFAULT_COLOR1 = 'rgb(0, 231, 255)';
const DEFAULT_COLOR2 = 'rgb(255, 0, 231)';

// For the sparkle linear gradient (Eevee-inspired from CodePen)
const SPARKLE_GRADIENT_COLORS = 'linear-gradient(125deg, #ff008450 15%, #fca40040 30%, #ffff0030 40%, #00ff8a20 60%, #00cfff40 70%, #cc4cfa50 85%)';

// Pre-defined background images for sparkles, including the holo.png
const SPARKLE_BG_IMAGES = `url("https://assets.codepen.io/13471/sparkles.gif"), url("https://assets.codepen.io/13471/holo.png"), ${SPARKLE_GRADIENT_COLORS}`;

// Pre-defined gradient for the main holographic overlay (CodePen's .card:before)
const GRADIENT_DEFAULT = `linear-gradient(115deg, transparent 0%, ${DEFAULT_COLOR1} 25%, transparent 47%, transparent 53%, ${DEFAULT_COLOR2} 75%, transparent 100%)`;
const GRADIENT_HOVER = `linear-gradient(110deg, transparent 25%, ${DEFAULT_COLOR1} 48%, ${DEFAULT_COLOR2} 52%, transparent 75%)`;


// Helper function to create a slug from product name
function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProductCard({ product, fourthwallCheckoutDomain, className }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Controls the CSS animation for non-hovered state
  const [transformStyle, setTransformStyle] = useState(''); // JS controlled transform for hover
  const [gradientDynamicPos, setGradientDynamicPos] = useState('50% 50%'); // JS controlled gradient pos for hover
  const [sparkleDynamicPos, setSparkleDynamicPos] = useState('50% 50%'); // JS controlled sparkle pos for hover
  const [sparkleDynamicOpacity, setSparkleDynamicOpacity] = useState(0.75); // JS controlled sparkle opacity for hover
  
  const imageUrl = getProductImage(product) || PLACEHOLDER_IMAGE_URL;
  const priceDisplay = getProductPrice(product);
  const description = getProductDescription(product);
  
  // Create a reliable slug - use the product's slug or generate one from the name
  const productSlug = product.slug || createSlugFromName(product.name);
  const productUrl = `/products/${productSlug}`;
  
  // Check if product has variants and is available
  const hasVariants = product.variants && product.variants.length > 0;
  const isAvailable = hasVariants && product.variants.some(variant => variant.unitPrice);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const l = e.clientX - rect.left;
    const t = e.clientY - rect.top;
    const h = rect.height;
    const w = rect.width;
    
    // Math for mouse position (from the Pokemon card effect - CodePen values)
    const px = Math.abs(Math.floor(100 / w * l) - 100);
    const py = Math.abs(Math.floor(100 / h * t) - 100);
    const pa = (50 - px) + (50 - py);
    
    // Math for gradient / background positions - CodePen values
    const lp = (50+(px - 50)/1.5);
    const tp = (50+(py - 50)/1.5);
    const px_spark = (50+(px - 50)/7);
    const py_spark = (50+(py - 50)/7);
    const p_opc = 20+(Math.abs(pa)*1.5);
    const ty = ((tp - 50)/2) * -1;
    const tx = ((lp - 50)/1.5) * .5;
    
    // Apply transformations
    setTransformStyle(`rotateX(${ty}deg) rotateY(${tx}deg)`);
    setGradientDynamicPos(`${lp}% ${tp}%`);
    setSparkleDynamicPos(`${px_spark}% ${py_spark}%`);
    setSparkleDynamicOpacity(Math.min(p_opc / 100, 1));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsAnimating(false); // Stop animation when hovered
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Allow transitions to complete before triggering CSS animation
    setTimeout(() => {
        setIsAnimating(true);
        // Stop the animation after its full cycle
        setTimeout(() => setIsAnimating(false), 12000); // Animation duration
    }, 550); // Slightly more than the longest transition (0.5s for transform)
  };

  return (
    <Card
      ref={cardRef}
      className={`
        relative
        flex flex-col
        w-72 h-full
        flex-shrink-0
        overflow-hidden
        touch-none
        border-0
        ${isAnimating ? 'animate-holo-card' : ''}
        ${className || ''}
      `}
      style={{
        // Apply JS transform only when hovered, otherwise let CSS animation handle it.
        transform: isHovered ? transformStyle : undefined, 
        transformOrigin: 'center',
        transformStyle: 'preserve-3d',
        borderRadius: '0', // Made edges square
        backgroundColor: '#040712',
        // CodePen's box-shadows for border glow
        boxShadow: isHovered 
          ? `-20px -20px 30px -25px ${DEFAULT_COLOR1}, 
             20px 20px 30px -25px ${DEFAULT_COLOR2}, 
             -7px -7px 10px -5px ${DEFAULT_COLOR1}, 
             7px 7px 10px -5px ${DEFAULT_COLOR2}, 
             0 0 13px 4px rgba(255,255,255,0.3),
             0 55px 35px -20px rgba(0, 0, 0, 0.5)`
          : `-5px -5px 5px -5px ${DEFAULT_COLOR1}, 
             5px 5px 5px -5px ${DEFAULT_COLOR2}, 
             -7px -7px 10px -5px transparent, 
             7px 7px 10px -5px transparent, 
             0 0 5px 0px rgba(255,255,255,0),
             0 55px 35px -20px rgba(0, 0, 0, 0.5)`, // Subtle initial shadow from CodePen
        willChange: 'transform, filter',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic gradient overlay (Corresponds to .card:before in CodePen) */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 ${isAnimating ? 'animate-holo-gradient' : ''}`}
        style={{
          backgroundImage: isHovered 
            ? GRADIENT_HOVER 
            : GRADIENT_DEFAULT,
          backgroundPosition: isHovered ? gradientDynamicPos : '50% 50%',
          backgroundSize: isHovered ? '250% 250%' : '300% 300%', // From CodePen
          opacity: isHovered ? 0.88 : 0.5, // From CodePen
          mixBlendMode: 'color-dodge',
          filter: isHovered ? 'brightness(0.66) contrast(1.33)' : 'brightness(0.5) contrast(1)', // From CodePen
        }}
      />
      
      {/* Sparkles and holographic effect (Corresponds to .card:after in CodePen) */}
      <div
        className={`absolute inset-0 pointer-events-none z-20 ${isAnimating ? 'animate-holo-sparkle' : ''}`}
        style={{
          backgroundImage: SPARKLE_BG_IMAGES, // Pre-defined for cleaner code
          backgroundPosition: isHovered ? sparkleDynamicPos : '50% 50%',
          backgroundSize: '160%', // From CodePen
          backgroundBlendMode: 'overlay',
          mixBlendMode: 'color-dodge',
          opacity: isHovered ? Math.min(sparkleDynamicOpacity * 1.8, 1) : 0.75, // Increased sparkle opacity on hover, base from CodePen
          filter: isHovered ? 'brightness(1) contrast(1)' : 'brightness(1) contrast(1)', // From CodePen, will be overridden by animation
        }}
      />

      <CardHeader className="p-0 relative z-30">
        <div className="relative w-full h-56 overflow-hidden" style={{ borderRadius: '0' }}> {/* Made image edges square */}
          <Image
            src={imageUrl}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4 relative z-30">
        <CardTitle className="text-xl font-bold mb-2 text-white line-clamp-2 transition-colors duration-300">
          {product.name}
        </CardTitle>
        
        <CardDescription
          className="text-sm text-gray-300 line-clamp-3 prose dark:prose-invert prose-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        
        {/* Variants preview */}
        {hasVariants && product.variants.length > 1 && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1">
              {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
            </p>
            <div className="flex flex-wrap gap-1 max-h-8 overflow-hidden">
              {product.variants.slice(0, 3).map((variant) => (
                <Badge 
                  key={variant.id}
                  variant="outline"
                  className="text-xs px-2 py-0 border-purple-400/40 text-purple-200 bg-purple-900/20"
                >
                  {variant.name}
                </Badge>
              ))}
              {product.variants.length > 3 && (
                <Badge 
                  variant="outline"
                  className="text-xs px-2 py-0 border-purple-400/40 text-purple-200 bg-purple-900/20"
                >
                  +{product.variants.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-start p-4 pt-0 relative z-30">
        {/* Left side: Price and Stock */}
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-white">
            {priceDisplay}
          </span>
          {hasVariants && product.variants.length > 1 && (
            <span className="text-xs text-gray-400 -mt-1">
              Starting from
            </span>
          )}
          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`
                w-2.5 h-2.5 rounded-full
                ${isAvailable ? 'bg-green-400' : 'bg-gray-500'}
              `}
            />
            <span
              className={`
                text-xs font-medium
                ${isAvailable ? 'text-green-300' : 'text-gray-400'}
              `}
            >
              {isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
        
        {/* Right side: Buttons */}
        <div className="flex flex-col gap-2">
          <Link href={productUrl} passHref>
            <Button 
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/25 button-holo-glow"
              size="sm"
            >
              View Details
            </Button>
          </Link>
          
          {/* Quick buy button for external link */}
          {fourthwallCheckoutDomain && (
            <Button
              variant="outline"
              size="sm"
              className="border-purple-400/40 text-purple-200 hover:bg-purple-600/20 text-xs bg-purple-900/20 button-holo-glow"
              onClick={() => window.open(`https://${fourthwallCheckoutDomain}/products/${productSlug}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Quick Buy
            </Button>
          )}
        </div>
      </CardFooter>
      
      {/* CSS animations for the holographic effect and button glows */}
      <style jsx>{`
        /* Card transitions (from CodePen) */
        .card {
          transition: transform 0.5s ease, box-shadow 0.2s ease;
        }

        /* Before/After pseudo-element transitions (from CodePen) */
        .card > div:first-of-type, .card > div:nth-of-type(2) { /* Targeting the overlay divs */
            transition: all 0.33s ease;
        }

        /* Keyframes from CodePen */
        @keyframes holo-card {
          0%, 100% { transform: rotateZ(0deg) rotateX(0deg) rotateY(0deg); }
          5%, 8% { transform: rotateZ(0deg) rotateX(6deg) rotateY(-20deg); }
          13%, 16% { transform: rotateZ(0deg) rotateX(-9deg) rotateY(32deg); }
          35%, 38% { transform: rotateZ(3deg) rotateX(12deg) rotateY(20deg); }
          55% { transform: rotateZ(-3deg) rotateX(-12deg) rotateY(-27deg); }
        }
        
        @keyframes holo-sparkle {
          0%, 100% { 
            opacity: 0.75; 
            background-position: 50% 50%; 
            filter: brightness(1.2) contrast(1.25);
          }
          5%, 8% { 
            opacity: 1; 
            background-position: 40% 40%; 
            filter: brightness(0.8) contrast(1.2);
          }
          13%, 16% { 
            opacity: 0.5; 
            background-position: 50% 50%; 
            filter: brightness(1.2) contrast(0.8);
          }
          35%, 38% { 
            opacity: 1; 
            background-position: 60% 60%; 
            filter: brightness(1) contrast(1);
          }
          55% { 
            opacity: 0.33; 
            background-position: 45% 45%; 
            filter: brightness(1.2) contrast(1.25);
          }
        }

        @keyframes holo-gradient {
          0%, 100% {
            opacity: 0.5;
            background-position: 50% 50%;
            filter: brightness(.5) contrast(1);
          }
          5%, 9% {
            background-position: 100% 100%;
            opacity: 1;
            filter: brightness(.75) contrast(1.25);
          }
          13%, 17% {
            background-position: 0% 0%;
            opacity: .88;
          }
          35%, 39% {
            background-position: 100% 100%;
            opacity: 1;
            filter: brightness(.5) contrast(1);
          }
          55% {
            background-position: 0% 0%;
            opacity: 1;
            filter: brightness(.75) contrast(1.25);
          }
        }
        
        .animate-holo-card {
          animation: holo-card 12s ease 0s 1;
        }
        
        .animate-holo-sparkle {
          animation: holo-sparkle 12s ease 0s 1;
        }

        .animate-holo-gradient {
          animation: holo-gradient 12s ease 0s 1;
        }

        /* Button Holographic Glow */
        .button-holo-glow {
          transition: box-shadow 0.2s ease-in-out;
        }

        .button-holo-glow:hover {
          box-shadow: 0 0 15px 3px rgba(128, 0, 255, 0.7), 0 0 5px 1px rgba(255, 255, 255, 0.5);
        }

        .button-holo-glow:active {
          box-shadow: 0 0 8px 1px rgba(128, 0, 255, 0.9), 0 0 2px 0px rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </Card>
  );
}