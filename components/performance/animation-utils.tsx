"use client";

import { useAnimationOptimization } from './optimization-context';
import { useEffect, useState } from 'react';

// Animation presets based on performance mode
export const animationPresets = {
  reduced: {
    duration: 0.15,
    easing: 'ease-out',
    scale: 0.5,
    blur: 2,
  },
  normal: {
    duration: 0.3,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    scale: 1,
    blur: 8,
  },
  enhanced: {
    duration: 0.5,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    scale: 1.2,
    blur: 12,
  },
};

// GPU-accelerated animation classes
export const gpuAnimationClasses = {
  transform: 'transform-gpu',
  fadeIn: 'animate-fade-in-gpu',
  slideUp: 'animate-slide-up-gpu',
  slideDown: 'animate-slide-down-gpu',
  slideLeft: 'animate-slide-left-gpu',
  slideRight: 'animate-slide-right-gpu',
  scale: 'animate-scale-gpu',
  rotate: 'animate-rotate-gpu',
  bounce: 'animate-bounce-gpu',
  pulse: 'animate-pulse-gpu',
};

// Hook for optimized animations
export function useOptimizedAnimation() {
  const { reduceAnimations, useGPUAcceleration, simplifyAnimations, animationDuration } = useAnimationOptimization();

  const getAnimationClass = (animationType: keyof typeof gpuAnimationClasses) => {
    if (reduceAnimations) return '';

    const baseClass = useGPUAcceleration
      ? gpuAnimationClasses[animationType]
      : animationType;

    return simplifyAnimations
      ? `${baseClass} duration-200`
      : `${baseClass} duration-300`;
  };

  const getAnimationStyle = (customDuration?: number) => {
    if (reduceAnimations) {
      return {
        transition: 'none',
        animation: 'none'
      };
    }

    return {
      animationDuration: `${customDuration || animationDuration}s`,
      transition: `all ${customDuration || animationDuration}s ease-out`,
      ...(useGPUAcceleration && {
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden' as const,
      }),
    };
  };

  const getTransitionStyle = (property: string = 'all', customDuration?: number) => {
    if (reduceAnimations) {
      return { transition: 'none' };
    }

    return {
      transition: `${property} ${customDuration || animationDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      ...(useGPUAcceleration && {
        willChange: property,
        transform: 'translateZ(0)',
      }),
    };
  };

  return {
    getAnimationClass,
    getAnimationStyle,
    getTransitionStyle,
    shouldAnimate: !reduceAnimations,
    animationDuration,
    useGPUAcceleration,
    simplifyAnimations,
  };
}

// Component wrapper for optimized animations
interface AnimatedProps {
  children: React.ReactNode;
  type?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  trigger?: boolean;
}

export function AnimatedElement({
  children,
  type = 'fadeIn',
  duration,
  delay = 0,
  className = '',
  style = {},
  trigger = true
}: AnimatedProps) {
  const { getAnimationStyle, shouldAnimate } = useOptimizedAnimation();
  const [isVisible, setIsVisible] = useState(!shouldAnimate || !trigger);

  useEffect(() => {
    if (shouldAnimate && trigger) {
      const timer = setTimeout(() => setIsVisible(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, trigger, delay]);

  if (!shouldAnimate) {
    return <div className={className} style={style}>{children}</div>;
  }

  const animationStyles = {
    ...getAnimationStyle(duration),
    animationDelay: `${delay}s`,
    ...style,
  };

  const animationClasses = {
    fadeIn: `transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`,
    slideUp: `transition-transform ${isVisible ? 'translate-y-0' : 'translate-y-8'}`,
    slideDown: `transition-transform ${isVisible ? 'translate-y-0' : '-translate-y-8'}`,
    slideLeft: `transition-transform ${isVisible ? 'translate-x-0' : 'translate-x-8'}`,
    slideRight: `transition-transform ${isVisible ? 'translate-x-0' : '-translate-x-8'}`,
    scale: `transition-transform ${isVisible ? 'scale-100' : 'scale-95'}`,
    rotate: `transition-transform ${isVisible ? 'rotate-0' : 'rotate-12'}`,
  };

  return (
    <div
      className={`${animationClasses[type]} ${className}`}
      style={animationStyles}
    >
      {children}
    </div>
  );
}

// Intersection Observer hook for scroll-triggered animations
export function useScrollAnimation(threshold: number = 0.1, rootMargin: string = '0px') {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return [setRef, isVisible] as const;
}

// Performance-aware animation frame hook
export function useAnimationFrame(callback: (time: number) => void, deps: React.DependencyList = []) {
  const { shouldAnimate } = useOptimizedAnimation();

  useEffect(() => {
    if (!shouldAnimate) return;

    let animationFrameId: number;

    const animate = (time: number) => {
      callback(time);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [shouldAnimate, callback, ...deps]);
}

// CSS-in-JS animation generator
export function generateOptimizedCSS() {
  const { useGPUAcceleration, animationDuration } = useOptimizedAnimation();

  return `
    /* Optimized Animation Classes */
    .transform-gpu {
      transform: translateZ(0);
      will-change: transform;
      backface-visibility: hidden;
    }

    .animate-fade-in-gpu {
      animation: fadeInGPU ${animationDuration}s ease-out;
    }

    .animate-slide-up-gpu {
      animation: slideUpGPU ${animationDuration}s ease-out;
    }

    .animate-slide-down-gpu {
      animation: slideDownGPU ${animationDuration}s ease-out;
    }

    .animate-scale-gpu {
      animation: scaleGPU ${animationDuration}s ease-out;
    }

    .animate-bounce-gpu {
      animation: bounceGPU ${animationDuration}s ease-out;
    }

    @keyframes fadeInGPU {
      from {
        opacity: 0;
        ${useGPUAcceleration ? 'transform: translateZ(0);' : ''}
      }
      to {
        opacity: 1;
        ${useGPUAcceleration ? 'transform: translateZ(0);' : ''}
      }
    }

    @keyframes slideUpGPU {
      from {
        opacity: 0;
        transform: translate3d(0, 20px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }

    @keyframes slideDownGPU {
      from {
        opacity: 0;
        transform: translate3d(0, -20px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }

    @keyframes scaleGPU {
      from {
        opacity: 0;
        transform: scale3d(0.9, 0.9, 1);
      }
      to {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    }

    @keyframes bounceGPU {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        transform: translate3d(0, -15px, 0);
      }
      70% {
        transform: translate3d(0, -7px, 0);
      }
      90% {
        transform: translate3d(0, -2px, 0);
      }
    }

    /* Performance optimizations */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
      .animate-fade-in-gpu,
      .animate-slide-up-gpu,
      .animate-slide-down-gpu,
      .animate-scale-gpu,
      .animate-bounce-gpu {
        animation-duration: ${animationDuration * 0.8}s;
      }
    }

    /* Low-end device optimizations */
    @media (max-width: 480px) {
      .transform-gpu {
        transform: none;
        will-change: auto;
      }
    }
  `;
}

// Stagger animation helper
export function useStaggerAnimation(items: unknown[], delay: number = 0.1) {
  const { shouldAnimate } = useOptimizedAnimation();
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!shouldAnimate) {
      setVisibleItems(new Set(items.map((_, index) => index)));
      return;
    }

    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]));
      }, index * delay * 1000);
    });
  }, [items, delay, shouldAnimate]);

  return (index: number) => visibleItems.has(index);
}
