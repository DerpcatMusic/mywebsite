"use client";

import AltProductsSection from "@/components/digital products/alt-products-section";
import FourthwallProductsSection from "@/components/fourthwall-products-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Gift,
  Heart,
  Maximize2,
  MessageSquare,
  Minimize2,
  Move,
  Settings,
  Share2,
  TrendingUp,
  Twitch,
  Users,
  Volume2,
  Youtube,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LivePage = () => {
  const [currentPlatform, setCurrentPlatform] = useState("youtube");
  const [chatMode, setChatMode] = useState("unified");
  const [chatBoxPosition, setChatBoxPosition] = useState("right");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const [streamSize, setStreamSize] = useState(() => {
    // Load saved size from memory or use default that fills the container
    if (typeof window !== "undefined") {
      const saved = sessionStorage?.getItem("streamSize");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // Fallback to default if parsing fails
        }
      }
    }
    // Default to a good size that fills most of the available space
    return { width: 1200, height: 675 }; // 16:9 aspect ratio, larger default
  });

  const streamRef = useRef(null);
  const resizeRef = useRef(null);
  const containerRef = useRef(null);

  // Simulate live viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 20) - 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Resizable stream functionality
  useEffect(() => {
    const handleMouseMove = e => {
      if (!isResizing || !containerRef.current) {
        return;
      }

      const containerRect =
        containerRef.current.parentElement.getBoundingClientRect();

      // Calculate new dimensions relative to the container's position
      const newWidth = e.clientX - containerRect.left - 16; // Account for padding
      const newHeight = e.clientY - containerRect.top - 16; // Account for padding

      const newSize = {
        width: Math.max(400, Math.min(newWidth, window.innerWidth - 200)),
        height: Math.max(300, Math.min(newHeight, window.innerHeight - 300)),
      };

      setStreamSize(newSize);

      // Save size to sessionStorage for persistence
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("streamSize", JSON.stringify(newSize));
        } catch (e) {
          // Handle storage errors gracefully
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
    };

    const handleMouseDown = () => {
      document.body.style.cursor = "nw-resize";
    };

    if (isResizing) {
      handleMouseDown();
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isResizing]);

  const youtubeVideoId = "live_stream?channel=UC9NQQqtoF84uFXW3jMfltEg";
  const twitchChannel = "derpcatmusic";

  // Chat mode styling based on selection
  const getChatBackgroundClass = () => {
    switch (chatMode) {
      case "youtube":
        return "bg-gradient-to-br from-red-500/5 via-card to-card border-red-500/20";
      case "twitch":
        return "bg-gradient-to-br from-purple-500/5 via-card to-card border-purple-500/20";
      case "tiktok":
        return "bg-gradient-to-br from-pink-500/5 via-card to-card border-pink-500/20";
      default:
        return "bg-gradient-to-br from-primary/5 via-card to-card border-primary/20";
    }
  };

  // Real chat integration note: This will be replaced by actual chat APIs
  // YouTube: YouTube Live Chat API, Twitch: Twitch Chat API (IRC), TikTok: TikTok Live API
  const renderVideoPlayer = () => {
    switch (currentPlatform) {
      case "youtube":
        return (
          <div className="group relative h-full w-full overflow-hidden rounded-lg bg-muted">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeVideoId}&autoplay=1`}
              title="YouTube Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Badge className="animate-pulse bg-red-500 px-3 py-1 font-semibold text-white">
                🔴 LIVE
              </Badge>
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm"
              >
                <Users className="mr-1 h-3 w-3" />
                {viewerCount.toLocaleString()}
              </Badge>
            </div>

            {/* Bigger Resize Handle - Position based on chat location */}
            <div
              ref={resizeRef}
              className={
                "absolute bottom-0 flex h-8 w-8 cursor-se-resize items-center justify-center rounded-tl-lg bg-primary/70 opacity-0 transition-all duration-200 hover:bg-primary group-hover:opacity-100"
              }
              style={{
                right: chatBoxPosition === "right" ? 0 : "auto",
                left: chatBoxPosition === "left" ? 0 : "auto",
              }}
              onMouseDown={e => {
                e.preventDefault();
                setIsResizing(true);
              }}
            >
              <Move className="h-5 w-5 text-white" />
            </div>
          </div>
        );
      case "twitch":
        return (
          <div className="group relative h-full w-full overflow-hidden rounded-lg bg-muted">
            <iframe
              src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&parent=derpcatmusic.com&autoplay=true`}
              height="100%"
              width="100%"
              allowFullScreen
              className="rounded-lg"
            />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Badge className="animate-pulse bg-purple-500 px-3 py-1 font-semibold text-white">
                🔴 LIVE
              </Badge>
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm"
              >
                <Users className="mr-1 h-3 w-3" />
                {viewerCount.toLocaleString()}
              </Badge>
            </div>

            {/* Bigger Resize Handle - Position based on chat location */}
            <div
              className={
                "absolute bottom-0 flex h-8 w-8 cursor-se-resize items-center justify-center rounded-tl-lg bg-primary/70 opacity-0 transition-all duration-200 hover:bg-primary group-hover:opacity-100"
              }
              style={{
                right: chatBoxPosition === "right" ? 0 : "auto",
                left: chatBoxPosition === "left" ? 0 : "auto",
              }}
              onMouseDown={() => setIsResizing(true)}
            >
              <Move className="h-5 w-5 text-white" />
            </div>
          </div>
        );
      case "tiktok":
        return (
          <div className="group relative flex h-full items-center justify-center rounded-lg bg-muted">
            <div className="space-y-4 text-center">
              <TrendingUp className="mx-auto h-16 w-16 animate-bounce text-primary" />
              <p className="text-xl font-semibold text-foreground">
                TikTok Live Coming Soon
              </p>
              <p className="text-muted-foreground">
                Enhanced streaming experience in development
              </p>
            </div>

            {/* Bigger Resize Handle */}
            <div
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-se-resize items-center justify-center rounded-tl-lg bg-primary/70 opacity-0 transition-all duration-200 hover:bg-primary group-hover:opacity-100"
              onMouseDown={e => {
                e.preventDefault();
                setIsResizing(true);
              }}
            >
              <Move className="h-5 w-5 text-white" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // This placeholder will be replaced with real chat integration
  // When streaming: YouTube Chat API, Twitch IRC, TikTok Live API
  const renderChatContent = () => {
    return (
      <div className="flex h-full flex-col">
        {/* Chat Mode Icons - Inside Chat Box */}
        <div className="flex justify-center gap-1 border-b border-border bg-accent/10 p-2">
          <Button
            size="sm"
            variant={chatMode === "unified" ? "default" : "ghost"}
            onClick={() => setChatMode("unified")}
            className="h-8 w-8 p-2"
            title="Unified Chat"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={chatMode === "youtube" ? "default" : "ghost"}
            onClick={() => setChatMode("youtube")}
            className="h-8 w-8 p-2"
            title="YouTube Chat"
          >
            <Youtube className="h-4 w-4 text-red-500" />
          </Button>
          <Button
            size="sm"
            variant={chatMode === "twitch" ? "default" : "ghost"}
            onClick={() => setChatMode("twitch")}
            className="h-8 w-8 p-2"
            title="Twitch Chat"
          >
            <Twitch className="h-4 w-4 text-purple-500" />
          </Button>
          <Button
            size="sm"
            variant={chatMode === "tiktok" ? "default" : "ghost"}
            onClick={() => setChatMode("tiktok")}
            className="h-8 w-8 p-2"
            title="TikTok Chat"
          >
            <TrendingUp className="h-4 w-4 text-pink-500" />
          </Button>
        </div>

        <CardHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-title flex items-center gap-2 text-lg font-bold text-foreground">
              <MessageSquare
                className={`h-5 w-5 ${
                  chatMode === "youtube"
                    ? "text-red-500"
                    : chatMode === "twitch"
                      ? "text-purple-500"
                      : chatMode === "tiktok"
                        ? "text-pink-500"
                        : "text-primary"
                }`}
              />
              Live Chat
            </h3>
            <Badge variant="outline" className="border-primary/20 text-xs">
              <Heart className="mr-1 h-3 w-3 fill-current text-primary" />
              {chatMode.charAt(0).toUpperCase() + chatMode.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-4 pt-4">
          {/*
            IMPORTANT: This placeholder content will be replaced when you go live!

            Real Implementation:
            - YouTube: Use YouTube Live Chat API to fetch real messages
            - Twitch: Connect to Twitch IRC for real-time chat
            - TikTok: Use TikTok Live API for chat messages
            - Unified: Combine all platform chats in real-time

            The chat will automatically populate with real viewer messages
            when your streams are active. No placeholder content will show.
          */}
          <div className="h-full space-y-3 overflow-y-auto pr-2 scrollbar-hide">
            <div className="py-8 text-center text-muted-foreground">
              <MessageSquare
                className={`mx-auto mb-2 h-12 w-12 opacity-50 ${
                  chatMode === "youtube"
                    ? "text-red-400"
                    : chatMode === "twitch"
                      ? "text-purple-400"
                      : chatMode === "tiktok"
                        ? "text-pink-400"
                        : "text-primary"
                }`}
              />
              <p className="text-sm">Chat will appear here when streaming</p>
              <p className="mt-1 text-xs">
                Connect your {chatMode} stream to see live messages
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={`Send message to ${chatMode} chat...`}
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                className="flex-1 border-border bg-accent/20 transition-colors focus:border-primary"
                disabled
              />
              <Button
                size="icon"
                variant="default"
                className="shrink-0 bg-primary hover:bg-primary/90"
                disabled
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Chat integration will be enabled when streaming
            </p>
          </div>
        </CardContent>
      </div>
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      streamRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="font-body min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-primary/5 backdrop-blur-sm">
        <div className="mx-auto px-8 py-6" style={{ maxWidth: "90vw" }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-title mb-2 text-3xl font-bold text-foreground">
                🎵 Derpcat Music Live
              </h1>
              <p className="text-muted-foreground">
                Multi-platform live streaming experience
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border hover:bg-accent"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto px-8 py-8" style={{ maxWidth: "90vw" }}>
        {/* Main Content */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Chat on Left */}
          {chatBoxPosition === "left" && (
            <Card
              className={`lg:w-96 xl:w-[28rem] ${getChatBackgroundClass()} border-2 shadow-xl`}
              style={{ height: `${streamSize.height + 120}px` }}
            >
              {renderChatContent()}
            </Card>
          )}

          {/* Video Player Section */}
          <div className="flex-1">
            {/* iOS Dynamic Island Style Platform Switcher */}
            <Card className="overflow-hidden border-border bg-card shadow-xl">
              {/* Dynamic Island - Platform Switcher */}
              <div className="flex items-center justify-center border-b border-border bg-gradient-to-r from-muted/50 via-accent/30 to-muted/50 p-3">
                <div className="flex items-center gap-3 rounded-full border border-border/50 bg-background/80 px-4 py-2 shadow-lg backdrop-blur-sm">
                  <button
                    onClick={() => setCurrentPlatform("youtube")}
                    className={`rounded-full p-2 transition-all duration-300 ${
                      currentPlatform === "youtube"
                        ? "scale-110 bg-red-500 text-white shadow-lg"
                        : "text-red-500 hover:scale-105 hover:bg-red-500/20"
                    }`}
                    title="YouTube Stream"
                  >
                    <Youtube className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPlatform("twitch")}
                    className={`rounded-full p-2 transition-all duration-300 ${
                      currentPlatform === "twitch"
                        ? "scale-110 bg-purple-500 text-white shadow-lg"
                        : "text-purple-500 hover:scale-105 hover:bg-purple-500/20"
                    }`}
                    title="Twitch Stream"
                  >
                    <Twitch className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPlatform("tiktok")}
                    className={`rounded-full p-2 transition-all duration-300 ${
                      currentPlatform === "tiktok"
                        ? "scale-110 bg-pink-500 text-white shadow-lg"
                        : "text-pink-500 hover:scale-105 hover:bg-pink-500/20"
                    }`}
                    title="TikTok Stream"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Video Player - Now properly resizable */}
              <div
                ref={containerRef}
                className="relative bg-accent/5 p-4"
                style={{
                  width: `${streamSize.width}px`,
                  height: `${streamSize.height}px`,
                  minWidth: "400px",
                  minHeight: "300px",
                }}
              >
                <div ref={streamRef} className="h-full w-full">
                  {renderVideoPlayer()}
                </div>
              </div>
            </Card>

            {/* Enhanced Video Controls */}
            <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-md">
              <div className="flex items-center gap-6">
                {/* Volume Control with Slider */}
                <div className="flex min-w-[120px] items-center gap-3">
                  <Volume2 className="h-4 w-4 text-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                  <span className="w-8 text-xs text-muted-foreground">
                    {volume[0]}%
                  </span>
                </div>

                {/* Fullscreen Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-border hover:bg-accent"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
              </div>

              <Button
                onClick={() =>
                  setChatBoxPosition(
                    chatBoxPosition === "right" ? "left" : "right"
                  )
                }
                variant="outline"
                className="gap-2 border-border hover:bg-accent"
              >
                <MessageSquare className="h-4 w-4" />
                Move Chat {chatBoxPosition === "right" ? "Left" : "Right"}
              </Button>
            </div>

            {/* Stream Info */}
            <div className="mt-4 rounded-lg border border-border bg-card p-4 shadow-md">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Viewers can resize the stream</strong> by dragging
                the larger corner handle when hovering over the video. Current
                size: {streamSize.width}x{streamSize.height}px
              </p>
            </div>
          </div>

          {/* Chat on Right - Wider */}
          {chatBoxPosition === "right" && (
            <Card
              className={`lg:w-96 xl:w-[28rem] ${getChatBackgroundClass()} border-2 shadow-xl`}
              style={{ height: `${streamSize.height + 120}px` }}
            >
              {renderChatContent()}
            </Card>
          )}
        </div>

        {/* Products sections side by side on larger screens */}
        <section className="mt-8 bg-background">
          <div className="mx-auto max-w-[90vw] px-2">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex flex-col">
                <FourthwallProductsSection />
              </div>
              <div className="flex flex-col">
                <AltProductsSection />
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <Card className="mt-12 border-border bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="font-title mb-4 flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
              <Heart className="h-6 w-6 animate-pulse fill-current text-red-500" />
              Support Derpcat Music
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Help keep the music flowing! Your support enables us to create
              more amazing content and improve our streaming experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="gap-2 bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl">
                <Gift className="h-4 w-4" />
                Merch Store
              </Button>
              <Button className="gap-2 bg-secondary text-secondary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-secondary/90 hover:shadow-xl">
                <Heart className="h-4 w-4 fill-current" />
                Donate
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-border transition-transform hover:scale-105 hover:bg-accent"
              >
                <Users className="h-4 w-4" />
                Join Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LivePage;
