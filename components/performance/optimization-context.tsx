"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface OptimizationSettings {
  // Image optimizations
  useWebP: boolean;
  useLazyLoading: boolean;
  useImagePlaceholders: boolean;

  // Animation optimizations
  reduceAnimations: boolean;
  useGPUAcceleration: boolean;
  simplifyAnimations: boolean;

  // Rendering optimizations
  useMemoization: boolean;
  useVirtualization: boolean;
  deferNonCritical: boolean;

  // Network optimizations
  prefetchCritical: boolean;
  enableServiceWorker: boolean;
  optimizeBundle: boolean;

  // Performance mode
  performanceMode: "auto" | "performance" | "quality";

  // Device-specific
  respectMotionPreference: boolean;
  adaptToConnection: boolean;
  adaptToMemory: boolean;
}

interface OptimizationContextType {
  settings: OptimizationSettings;
  updateSetting: (
    key: keyof OptimizationSettings,
    value: boolean | string
  ) => void;
  resetToDefaults: () => void;
  isOptimized: boolean;
  deviceCapabilities: {
    isLowEnd: boolean;
    hasSlowConnection: boolean;
    prefersReducedMotion: boolean;
    memoryStatus: "low" | "medium" | "high";
  };
}

const defaultSettings: OptimizationSettings = {
  useWebP: true,
  useLazyLoading: true,
  useImagePlaceholders: true,

  reduceAnimations: false,
  useGPUAcceleration: true,
  simplifyAnimations: false,

  useMemoization: true,
  useVirtualization: false,
  deferNonCritical: true,

  prefetchCritical: true,
  enableServiceWorker: false,
  optimizeBundle: true,

  performanceMode: "auto",

  respectMotionPreference: true,
  adaptToConnection: true,
  adaptToMemory: true,
};

const OptimizationContext = createContext<OptimizationContextType | undefined>(
  undefined
);

export function OptimizationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] =
    useState<OptimizationSettings>(defaultSettings);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isLowEnd: false,
    hasSlowConnection: false,
    prefersReducedMotion: false,
    memoryStatus: "medium" as "low" | "medium" | "high",
  });

  // Detect device capabilities
  useEffect(() => {
    const detectCapabilities = () => {
      let isLowEnd = false;
      let hasSlowConnection = false;
      let prefersReducedMotion = false;
      let memoryStatus: "low" | "medium" | "high" = "medium";

      // Check for low-end device
      if ("hardwareConcurrency" in navigator) {
        isLowEnd = navigator.hardwareConcurrency <= 2;
      }

      // Check connection
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        hasSlowConnection =
          connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g" ||
          connection.downlink < 1;
      }

      // Check motion preference
      if (window.matchMedia) {
        prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }

      // Check memory
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const totalMemory = memory.totalJSHeapSize;
        if (totalMemory < 50 * 1024 * 1024) {
          // Less than 50MB
          memoryStatus = "low";
        } else if (totalMemory > 200 * 1024 * 1024) {
          // More than 200MB
          memoryStatus = "high";
        }
      }

      setDeviceCapabilities({
        isLowEnd,
        hasSlowConnection,
        prefersReducedMotion,
        memoryStatus,
      });
    };

    detectCapabilities();

    // Listen for connection changes
    if ("connection" in navigator) {
      (navigator as any).connection.addEventListener("change", detectCapabilities);
    }

    // Listen for motion preference changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", detectCapabilities);
    }

    return () => {
      if ("connection" in navigator) {
        (navigator as any).connection.removeEventListener("change", detectCapabilities);
      }
    };
  }, []);

  // Auto-adjust settings based on device capabilities
  useEffect(() => {
    if (settings.performanceMode === "auto") {
      const autoSettings: Partial<OptimizationSettings> = {};

      if (deviceCapabilities.isLowEnd || deviceCapabilities.hasSlowConnection) {
        autoSettings.reduceAnimations = true;
        autoSettings.simplifyAnimations = true;
        autoSettings.useVirtualization = true;
        autoSettings.deferNonCritical = true;
      }

      if (
        deviceCapabilities.prefersReducedMotion &&
        settings.respectMotionPreference
      ) {
        autoSettings.reduceAnimations = true;
        autoSettings.simplifyAnimations = true;
      }

      if (deviceCapabilities.memoryStatus === "low") {
        autoSettings.useMemoization = true;
        autoSettings.deferNonCritical = true;
        autoSettings.optimizeBundle = true;
      }

      if (Object.keys(autoSettings).length > 0) {
        setSettings(prev => ({ ...prev, ...autoSettings }));
      }
    }
  }, [
    deviceCapabilities,
    settings.performanceMode,
    settings.respectMotionPreference,
  ]);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("optimization-settings");
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.warn("Failed to load optimization settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("optimization-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (
    key: keyof OptimizationSettings,
    value: boolean | string
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("optimization-settings");
  };

  // Determine if optimizations are active
  const isOptimized =
    settings.performanceMode === "performance" ||
    (settings.performanceMode === "auto" && (
      (deviceCapabilities.isLowEnd ||
        deviceCapabilities.hasSlowConnection ||
        deviceCapabilities.memoryStatus === "low"));

  return (
    <OptimizationContext.Provider
      value={{
        settings,
        updateSetting,
        resetToDefaults,
        isOptimized,
        deviceCapabilities,
      }}
    >
      {children}
    </OptimizationContext.Provider>
  );
}

export function useOptimization() {
  const context = useContext(OptimizationContext);
  if (context === undefined) {
    throw new Error("useOptimization must be used within an OptimizationProvider");
  }
  return context;
}

// Utility hooks for specific optimizations
export function useImageOptimization() {
  const { settings, isOptimized } = useOptimization();
  return {
    useWebP: settings.useWebP && isOptimized,
    useLazyLoading: settings.useLazyLoading,
    useImagePlaceholders: settings.useImagePlaceholders && isOptimized,
  };
}

export function useAnimationOptimization() {
  const { settings, isOptimized, deviceCapabilities } = useOptimization();
  return {
    reduceAnimations:
      settings.reduceAnimations ||
      (deviceCapabilities.prefersReducedMotion &&
        settings.respectMotionPreference),
    useGPUAcceleration:
      settings.useGPUAcceleration && !deviceCapabilities.isLowEnd,
    simplifyAnimations: settings.simplifyAnimations || isOptimized,
    animationDuration: isOptimized ? 0.2 : 0.3,
  };
}

export function useRenderOptimization() {
  const { settings, isOptimized } = useOptimization();
  return {
    useMemoization: settings.useMemoization,
    useVirtualization: settings.useVirtualization && isOptimized,
    deferNonCritical: settings.deferNonCritical && isOptimized,
  };
}
