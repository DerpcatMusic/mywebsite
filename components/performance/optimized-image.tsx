"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useImageOptimization } from './optimization-context';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  sizes,
  style,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const { useWebP, useLazyLoading, useImagePlaceholders } = useImageOptimization();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority || !useLazyLoading);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!useLazyLoading || priority || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Load images 50px before they come into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [useLazyLoading, priority, isVisible]);

  // WebP format support detection
  const getOptimizedSrc = (originalSrc: string) => {
    if (!useWebP || hasError) return originalSrc;

    // Check if the image is already optimized or external
    if (originalSrc.includes('.webp') || originalSrc.startsWith('http')) {
      return originalSrc;
    }

    // For Next.js optimization, we rely on the built-in Image component
    return originalSrc;
  };

  // Generate placeholder
  const getPlaceholder = () => {
    if (!useImagePlaceholders) return 'empty';
    if (blurDataURL) return 'blur';

    // Generate a simple blur placeholder based on dimensions
    if (width && height) {
      const canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, 10, 10);
        return canvas.toDataURL();
      }
    }

    return 'empty';
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        ...style,
      }}
    />
  );

  // Error fallback
  const ErrorFallback = () => (
    <div
      className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 ${className}`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        ...style,
      }}
    >
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );

  return (
    <div ref={imgRef} className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {/* Show skeleton while loading or not visible */}
      {(!isVisible || (!isLoaded && !hasError)) && !priority && (
        <LoadingSkeleton />
      )}

      {/* Show error fallback */}
      {hasError && <ErrorFallback />}

      {/* Show image when visible and not errored */}
      {isVisible && !hasError && (
        <Image
          src={getOptimizedSrc(src)}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={style}
          quality={quality}
          priority={priority}
          placeholder={getPlaceholder() as any}
          blurDataURL={
            getPlaceholder() === 'blur'
              ? blurDataURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+XvAVJfcTCqEgB5DaKLq8Tv0KWn6LdpjdnE=='
              : undefined
          }
          sizes={
            sizes ||
            (fill
              ? '100vw'
              : `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`)
          }
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

// Utility function for generating blur placeholders
export function generateBlurPlaceholder(
  width: number,
  height: number,
  color: string = '#f3f4f6'
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 10;
  canvas.height = 10;

  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 10, 10);
    return canvas.toDataURL();
  }

  return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
}

// HOC for wrapping existing Image components
export function withOptimization<P extends object>(
  Component: React.ComponentType<P>
) {
  return function OptimizedComponent(props: P) {
    const { useWebP, useLazyLoading, useImagePlaceholders } = useImageOptimization();

    const optimizedProps = {
      ...props,
      ...(useWebP && { quality: 85 }),
      ...(useLazyLoading && { loading: 'lazy' as const }),
      ...(useImagePlaceholders && { placeholder: 'blur' as const }),
    };

    return <Component {...optimizedProps} />;
  };
}
