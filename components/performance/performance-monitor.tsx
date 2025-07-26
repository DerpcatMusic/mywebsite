"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  paintTime: number;
  bundleSize: number;
  networkRequests: number;
  cacheHitRatio: number;
  renderTime: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error';
  message: string;
  timestamp: number;
}

export default function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: { used: 0, total: 0, percentage: 0 },
    paintTime: 0,
    bundleSize: 0,
    networkRequests: 0,
    cacheHitRatio: 0,
    renderTime: 0,
  });
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();
  const performanceObserverRef = useRef<PerformanceObserver>();
  const networkRequestsRef = useRef(0);
  const cacheHitsRef = useRef(0);

  // Check if we're on localhost
  const isLocalhost = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  }, []);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  // FPS Calculation
  const calculateFPS = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      setMetrics(prev => ({ ...prev, fps }));

      // FPS alerts
      if (fps < 30) {
        setAlerts(prev => [...prev.slice(-4), {
          type: 'error',
          message: `Low FPS: ${fps}`,
          timestamp: Date.now()
        }]);
      } else if (fps < 45) {
        setAlerts(prev => [...prev.slice(-4), {
          type: 'warning',
          message: `FPS Warning: ${fps}`,
          timestamp: Date.now()
        }]);
      }

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(calculateFPS);
  }, []);

  // Memory Usage
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = Math.round(memory.usedJSHeapSize / 1048576); // MB
      const total = Math.round(memory.totalJSHeapSize / 1048576); // MB
      const percentage = Math.round((used / total) * 100);

      setMetrics(prev => ({ ...prev, memory: { used, total, percentage } }));

      // Memory alerts
      if (percentage > 85) {
        setAlerts(prev => [...prev.slice(-4), {
          type: 'error',
          message: `High memory usage: ${percentage}%`,
          timestamp: Date.now()
        }]);
      } else if (percentage > 70) {
        setAlerts(prev => [...prev.slice(-4), {
          type: 'warning',
          message: `Memory warning: ${percentage}%`,
          timestamp: Date.now()
        }]);
      }
    }
  }, []);

  // Performance Observer for paint timing
  const setupPerformanceObserver = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'paint') {
              setMetrics(prev => ({ ...prev, paintTime: Math.round(entry.startTime) }));
            } else if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              const renderTime = navEntry.loadEventEnd - navEntry.navigationStart;
              setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime) }));
            }
          });
        });

        observer.observe({ entryTypes: ['paint', 'navigation'] });
        performanceObserverRef.current = observer;
      } catch (e) {
        console.warn('PerformanceObserver not supported');
      }
    }
  }, []);

  // Network monitoring
  const monitorNetwork = useCallback(() => {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      networkRequestsRef.current++;
      setMetrics(prev => ({ ...prev, networkRequests: networkRequestsRef.current }));

      return originalFetch(...args).then(response => {
        if (response.headers.get('cache-control')) {
          cacheHitsRef.current++;
        }
        const ratio = networkRequestsRef.current > 0 ?
          Math.round((cacheHitsRef.current / networkRequestsRef.current) * 100) : 0;
        setMetrics(prev => ({ ...prev, cacheHitRatio: ratio }));
        return response;
      });
    };
  }, []);

  // Bundle size estimation
  const estimateBundleSize = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const transferSize = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (transferSize && transferSize.transferSize) {
        const sizeKB = Math.round(transferSize.transferSize / 1024);
        setMetrics(prev => ({ ...prev, bundleSize: sizeKB }));
      }
    }
  }, []);

  useEffect(() => {
    // Only show on localhost or in development
    if (!isLocalhost() && !isDevelopment) {
      return;
    }

    setIsVisible(true);

    // Start monitoring
    calculateFPS();
    setupPerformanceObserver();
    monitorNetwork();
    estimateBundleSize();

    // Update intervals
    const memoryInterval = setInterval(updateMemoryUsage, 1000);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
      clearInterval(memoryInterval);
    };
  }, [isLocalhost, isDevelopment, calculateFPS, setupPerformanceObserver, monitorNetwork, estimateBundleSize, updateMemoryUsage]);

  const getFPSColor = (fps: number) => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMemoryColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-400';
    if (percentage < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
      <div className={`bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-12 h-12' : 'w-80 max-h-96'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-semibold">Performance Monitor</span>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? '📊' : '─'}
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Metrics Grid */}
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">FPS</div>
                  <div className={`text-lg font-bold ${getFPSColor(metrics.fps)}`}>
                    {metrics.fps}
                  </div>
                </div>

                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">Memory</div>
                  <div className={`text-lg font-bold ${getMemoryColor(metrics.memory.percentage)}`}>
                    {metrics.memory.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {metrics.memory.used}/{metrics.memory.total}MB
                  </div>
                </div>

                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">Paint</div>
                  <div className="text-lg font-bold text-blue-400">
                    {metrics.paintTime}ms
                  </div>
                </div>

                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">Bundle</div>
                  <div className="text-lg font-bold text-purple-400">
                    {metrics.bundleSize}KB
                  </div>
                </div>

                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">Network</div>
                  <div className="text-lg font-bold text-cyan-400">
                    {metrics.networkRequests}
                  </div>
                </div>

                <div className="bg-gray-800/50 p-2 rounded">
                  <div className="text-gray-400">Cache</div>
                  <div className="text-lg font-bold text-indigo-400">
                    {metrics.cacheHitRatio}%
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-2 rounded">
                <div className="text-gray-400">Render Time</div>
                <div className="text-lg font-bold text-orange-400">
                  {metrics.renderTime}ms
                </div>
              </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="border-t border-gray-600 p-2 max-h-24 overflow-y-auto">
                <div className="text-gray-400 text-xs mb-1">Alerts</div>
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`text-xs p-1 rounded mb-1 ${
                      alert.type === 'error'
                        ? 'bg-red-900/50 text-red-300'
                        : 'bg-yellow-900/50 text-yellow-300'
                    }`}
                  >
                    {alert.message}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
