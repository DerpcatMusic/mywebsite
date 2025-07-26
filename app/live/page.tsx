'use client';

import AltProductsSection from '@/components/digital products/alt-products-section';
import FourthwallProductsSection from '@/components/fourthwall-products-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Gift, Heart, Maximize2, MessageSquare, Minimize2, Move, Settings, Share2, TrendingUp, Twitch, Users, Volume2, Youtube } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const LivePage = () => {
  const [currentPlatform, setCurrentPlatform] = useState('youtube');
  const [chatMode, setChatMode] = useState('unified');
  const [chatBoxPosition, setChatBoxPosition] = useState('right');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [isResizing, setIsResizing] = useState(false);
  const [streamSize, setStreamSize] = useState(() => {
    // Load saved size from memory or use default that fills the container
    if (typeof window !== 'undefined') {
      const saved = sessionStorage?.getItem('streamSize');
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
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.parentElement.getBoundingClientRect();

      // Calculate new dimensions relative to the container's position
      const newWidth = e.clientX - containerRect.left - 16; // Account for padding
      const newHeight = e.clientY - containerRect.top - 16; // Account for padding

      const newSize = {
        width: Math.max(400, Math.min(newWidth, window.innerWidth - 200)),
        height: Math.max(300, Math.min(newHeight, window.innerHeight - 300))
      };

      setStreamSize(newSize);

      // Save size to sessionStorage for persistence
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('streamSize', JSON.stringify(newSize));
        } catch (e) {
          // Handle storage errors gracefully
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    const handleMouseDown = () => {
      document.body.style.cursor = 'nw-resize';
    };

    if (isResizing) {
      handleMouseDown();
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizing]);

  const youtubeVideoId = 'live_stream?channel=UC9NQQqtoF84uFXW3jMfltEg';
  const twitchChannel = 'derpcatmusic';

  // Chat mode styling based on selection
  const getChatBackgroundClass = () => {
    switch (chatMode) {
      case 'youtube':
        return 'bg-gradient-to-br from-red-500/5 via-card to-card border-red-500/20';
      case 'twitch':
        return 'bg-gradient-to-br from-purple-500/5 via-card to-card border-purple-500/20';
      case 'tiktok':
        return 'bg-gradient-to-br from-pink-500/5 via-card to-card border-pink-500/20';
      default:
        return 'bg-gradient-to-br from-primary/5 via-card to-card border-primary/20';
    }
  };

  // Real chat integration note: This will be replaced by actual chat APIs
  // YouTube: YouTube Live Chat API, Twitch: Twitch Chat API (IRC), TikTok: TikTok Live API
  const renderVideoPlayer = () => {
    switch (currentPlatform) {
      case 'youtube':
        return (
          <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden group">
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
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge className="bg-red-500 text-white animate-pulse px-3 py-1 font-semibold">
                🔴 LIVE
              </Badge>
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Users className="w-3 h-3 mr-1" />
                {viewerCount.toLocaleString()}
              </Badge>
            </div>

            {/* Bigger Resize Handle - Position based on chat location */}
            <div
              ref={resizeRef}
              className={`absolute bottom-0 w-8 h-8 bg-primary/70 hover:bg-primary opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-se-resize rounded-tl-lg`}
              style={{
                right: chatBoxPosition === 'right' ? 0 : 'auto',
                left: chatBoxPosition === 'left' ? 0 : 'auto'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizing(true);
              }}
            >
              <Move className="w-5 h-5 text-white" />
            </div>
          </div>
        );
      case 'twitch':
        return (
          <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden group">
            <iframe
              src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&parent=derpcatmusic.com&autoplay=true`}
              height="100%"
              width="100%"
              allowFullScreen
              className="rounded-lg"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge className="bg-purple-500 text-white animate-pulse px-3 py-1 font-semibold">
                🔴 LIVE
              </Badge>
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Users className="w-3 h-3 mr-1" />
                {viewerCount.toLocaleString()}
              </Badge>
            </div>

            {/* Bigger Resize Handle - Position based on chat location */}
            <div
              className={`absolute bottom-0 w-8 h-8 bg-primary/70 hover:bg-primary opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-se-resize rounded-tl-lg`}
              style={{
                right: chatBoxPosition === 'right' ? 0 : 'auto',
                left: chatBoxPosition === 'left' ? 0 : 'auto'
              }}
              onMouseDown={() => setIsResizing(true)}
            >
              <Move className="w-5 h-5 text-white" />
            </div>
          </div>
        );
      case 'tiktok':
        return (
          <div className="flex items-center justify-center h-full bg-muted rounded-lg group relative">
            <div className="text-center space-y-4">
              <TrendingUp className="w-16 h-16 text-primary mx-auto animate-bounce" />
              <p className="text-xl font-semibold text-foreground">TikTok Live Coming Soon</p>
              <p className="text-muted-foreground">Enhanced streaming experience in development</p>
            </div>

            {/* Bigger Resize Handle */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary/70 hover:bg-primary cursor-se-resize opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-tl-lg flex items-center justify-center"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizing(true);
              }}
            >
              <Move className="w-5 h-5 text-white" />
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
      <div className="flex flex-col h-full">
        {/* Chat Mode Icons - Inside Chat Box */}
        <div className="flex justify-center gap-1 p-2 border-b border-border bg-accent/10">
          <Button
            size="sm"
            variant={chatMode === 'unified' ? 'default' : 'ghost'}
            onClick={() => setChatMode('unified')}
            className="p-2 h-8 w-8"
            title="Unified Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={chatMode === 'youtube' ? 'default' : 'ghost'}
            onClick={() => setChatMode('youtube')}
            className="p-2 h-8 w-8"
            title="YouTube Chat"
          >
            <Youtube className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            size="sm"
            variant={chatMode === 'twitch' ? 'default' : 'ghost'}
            onClick={() => setChatMode('twitch')}
            className="p-2 h-8 w-8"
            title="Twitch Chat"
          >
            <Twitch className="w-4 h-4 text-purple-500" />
          </Button>
          <Button
            size="sm"
            variant={chatMode === 'tiktok' ? 'default' : 'ghost'}
            onClick={() => setChatMode('tiktok')}
            className="p-2 h-8 w-8"
            title="TikTok Chat"
          >
            <TrendingUp className="w-4 h-4 text-pink-500" />
          </Button>
        </div>

        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-title flex items-center gap-2 text-foreground">
              <MessageSquare className={`w-5 h-5 ${
                chatMode === 'youtube' ? 'text-red-500' :
                chatMode === 'twitch' ? 'text-purple-500' :
                chatMode === 'tiktok' ? 'text-pink-500' :
                'text-primary'
              }`} />
              Live Chat
            </h3>
            <Badge variant="outline" className="text-xs border-primary/20">
              <Heart className="w-3 h-3 mr-1 fill-current text-primary" />
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
          <div className="h-full overflow-y-auto space-y-3 scrollbar-hide pr-2">
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className={`w-12 h-12 mx-auto mb-2 opacity-50 ${
                chatMode === 'youtube' ? 'text-red-400' :
                chatMode === 'twitch' ? 'text-purple-400' :
                chatMode === 'tiktok' ? 'text-pink-400' :
                'text-primary'
              }`} />
              <p className="text-sm">Chat will appear here when streaming</p>
              <p className="text-xs mt-1">Connect your {chatMode} stream to see live messages</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={`Send message to ${chatMode} chat...`}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-accent/20 border-border focus:border-primary transition-colors"
                disabled
              />
              <Button size="icon" variant="default" className="shrink-0 bg-primary hover:bg-primary/90" disabled>
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Chat integration will be enabled when streaming</p>
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
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border backdrop-blur-sm">
        <div className="mx-auto px-8 py-6" style={{ maxWidth: '90vw' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-title text-foreground mb-2">
                🎵 Derpcat Music Live
              </h1>
              <p className="text-muted-foreground">Multi-platform live streaming experience</p>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2 border-border hover:bg-accent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-border hover:bg-accent">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto px-8 py-8" style={{ maxWidth: '90vw' }}>
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chat on Left */}
          {chatBoxPosition === 'left' && (
            <Card className={`lg:w-96 xl:w-[28rem] ${getChatBackgroundClass()} shadow-xl border-2`} style={{ height: `${streamSize.height + 120}px` }}>
              {renderChatContent()}
            </Card>
          )}

          {/* Video Player Section */}
          <div className="flex-1">
            {/* iOS Dynamic Island Style Platform Switcher */}
            <Card className="bg-card border-border shadow-xl overflow-hidden">
              {/* Dynamic Island - Platform Switcher */}
              <div className="flex items-center justify-center p-3 bg-gradient-to-r from-muted/50 via-accent/30 to-muted/50 border-b border-border">
                <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50 shadow-lg">
                  <button
                    onClick={() => setCurrentPlatform('youtube')}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      currentPlatform === 'youtube'
                        ? 'bg-red-500 text-white shadow-lg scale-110'
                        : 'hover:bg-red-500/20 text-red-500 hover:scale-105'
                    }`}
                    title="YouTube Stream"
                  >
                    <Youtube className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPlatform('twitch')}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      currentPlatform === 'twitch'
                        ? 'bg-purple-500 text-white shadow-lg scale-110'
                        : 'hover:bg-purple-500/20 text-purple-500 hover:scale-105'
                    }`}
                    title="Twitch Stream"
                  >
                    <Twitch className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPlatform('tiktok')}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      currentPlatform === 'tiktok'
                        ? 'bg-pink-500 text-white shadow-lg scale-110'
                        : 'hover:bg-pink-500/20 text-pink-500 hover:scale-105'
                    }`}
                    title="TikTok Stream"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Player - Now properly resizable */}
              <div
                ref={containerRef}
                className="p-4 bg-accent/5 relative"
                style={{
                  width: `${streamSize.width}px`,
                  height: `${streamSize.height}px`,
                  minWidth: '400px',
                  minHeight: '300px'
                }}
              >
                <div ref={streamRef} className="w-full h-full">
                  {renderVideoPlayer()}
                </div>
              </div>
            </Card>

            {/* Enhanced Video Controls */}
            <div className="flex items-center justify-between mt-4 p-4 bg-card border border-border rounded-lg shadow-md">
              <div className="flex items-center gap-6">
                {/* Volume Control with Slider */}
                <div className="flex items-center gap-3 min-w-[120px]">
                  <Volume2 className="w-4 h-4 text-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
                </div>

                {/* Fullscreen Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-border hover:bg-accent"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
              </div>

              <Button
                onClick={() => setChatBoxPosition(chatBoxPosition === 'right' ? 'left' : 'right')}
                variant="outline"
                className="gap-2 border-border hover:bg-accent"
              >
                <MessageSquare className="w-4 h-4" />
                Move Chat {chatBoxPosition === 'right' ? 'Left' : 'Right'}
              </Button>
            </div>

            {/* Stream Info */}
            <div className="mt-4 p-4 bg-card border border-border rounded-lg shadow-md">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Viewers can resize the stream</strong> by dragging the larger corner handle when hovering over the video. Current size: {streamSize.width}x{streamSize.height}px
              </p>
            </div>
          </div>

          {/* Chat on Right - Wider */}
          {chatBoxPosition === 'right' && (
            <Card className={`lg:w-96 xl:w-[28rem] ${getChatBackgroundClass()} shadow-xl border-2`} style={{ height: `${streamSize.height + 120}px` }}>
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
        <Card className="mt-12 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-border shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold font-title mb-4 flex items-center justify-center gap-2 text-foreground">
              <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
              Support Derpcat Music
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Help keep the music flowing! Your support enables us to create more amazing content and improve our streaming experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Gift className="w-4 h-4" />
                Merch Store
              </Button>
              <Button className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Heart className="w-4 h-4 fill-current" />
                Donate
              </Button>
              <Button variant="outline" className="gap-2 hover:scale-105 transition-transform border-border hover:bg-accent">
                <Users className="w-4 h-4" />
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
