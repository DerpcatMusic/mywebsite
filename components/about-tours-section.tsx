"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  ExternalLink,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

interface TourDate {
  id: string;
  date: string;
  venue: string;
  city: string;
  state: string;
  time: string;
  ticketLink: string;
  soldOut?: boolean;
}

function formatDate(dateString: string) {
  if (!dateString) {
    return { month: "N/A", day: "N/A", weekday: "N/A" };
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { month: "N/A", day: "N/A", weekday: "N/A" };
  }
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate(),
    weekday: date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
  };
}

export default function AboutToursSection() {
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const toursRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(aboutRef.current, {
        x: -100,
        autoAlpha: 0, // Use autoAlpha for better performance/visibility handling
        duration: 1,
        ease: "power3.out",
      }).from(
        toursRef.current,
        {
          x: 100,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8"
      );

      // Stagger internal elements
      if (aboutRef.current) {
        gsap.from(aboutRef.current.children, {
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.2,
        });
      }
    },
    { scope: containerRef }
  );

  useEffect(() => {
    const fetchTourDates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/tour-dates");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
            `Failed to fetch tour dates (Status: ${response.status})`
          );
        }
        const data: TourDate[] = await response.json();
        setTourDates(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching tour dates.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDates();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="flex h-full items-center bg-background py-20"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* About Section */}
          <div
            ref={aboutRef}
            className="flex flex-col justify-center lg:col-span-2"
          >
            <h2 className="mb-8 font-pixel text-4xl font-bold uppercase text-foreground md:text-5xl">
              About <span className="text-primary">Derpcat</span>
            </h2>

            <div className="space-y-8">
              <p className="font-terminal text-xl leading-relaxed text-muted-foreground md:text-2xl">
                Born in 03', Been producing music since the age of 13. (u do the
                math) Got on various big labels such as NCS, Monstercat,
                Ophelia, Most Addictive and more. I write, compose and produce
                all sorts of music wether it's Electronic, Pop and even
                Orchestra. I got a big passion for Sound Design, Graphic Design,
                Software and many many more.
              </p>

              <div className="mt-12 inline-block transform border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-8 transition-transform duration-300 hover:scale-105">
                <p className="mb-4 font-serif text-lg italic text-muted-foreground">
                  "My name isn't typical but so is my music, and for that I
                  always say: Expect the Unexpected"
                </p>
                <p className="font-pixel font-semibold text-primary">
                  - Derpcat
                </p>
              </div>
            </div>
          </div>

          {/* Tours Section */}
          <div
            ref={toursRef}
            id="tours"
            className="flex flex-col justify-center rounded-xl border border-white/5 bg-card/5 p-6 lg:col-span-1"
          >
            <h3 className="mb-8 text-right font-pixel text-3xl font-bold uppercase text-foreground md:text-4xl">
              Upcoming <span className="text-primary">Shows</span>
            </h3>

            {isLoading ? (
              <div className="flex-grow py-8 text-center">
                <RefreshCw className="mx-auto mb-4 h-12 w-12 animate-spin text-primary/50" />
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  Loading Shows...
                </h4>
              </div>
            ) : error ? (
              <div className="flex-grow py-8 text-center">
                <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500/70" />
                <h4 className="mb-2 text-lg font-semibold text-destructive">
                  Error Loading Shows
                </h4>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            ) : (
              <div className="scrollbar-thin scrollbar-thumb-primary/20 max-h-[50vh] flex-grow space-y-4 overflow-y-auto pr-2">
                {tourDates.map(show => {
                  const dateInfo = formatDate(show.date);
                  return (
                    <Card
                      key={show.id}
                      className="glass-card group transition-all duration-300 hover:translate-x-2 hover:border-primary/40 hover:bg-white/10"
                      style={{ borderRadius: "0.75rem" }}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <div className="min-w-[60px] text-center">
                              <div className="font-pixel text-sm font-bold text-primary">
                                {dateInfo.month}
                              </div>
                              <div className="font-pixel text-xl font-bold text-white">
                                {dateInfo.day}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="mb-1 truncate font-terminal text-sm font-semibold text-foreground">
                                {show.venue}
                              </h4>
                              <div className="mb-1 flex items-center text-xs text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {show.city}, {show.state}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full">
                            {show.soldOut ? (
                              <div className="w-full bg-muted px-4 py-2 text-center font-pixel text-sm font-bold text-muted-foreground">
                                Sold Out
                              </div>
                            ) : (
                              <Button
                                asChild
                                className="group/btn pixel-btn w-full rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all duration-150 hover:bg-primary/80"
                              >
                                <a
                                  href={show.ticketLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Get Tickets
                                  <ExternalLink className="ml-2 h-3 w-3 transition-transform duration-150 group-hover/btn:translate-x-1" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!isLoading && !error && tourDates.length === 0 && (
              <div className="flex-grow py-8 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-primary/50" />
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  No Shows Scheduled
                </h4>
              </div>
            )}

            <div className="mt-6 flex flex-row space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
              <Button
                asChild
                className="pixel-btn w-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all duration-150 hover:bg-primary/90"
              >
                <a
                  href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate"
                >
                  Follow on Bandsintown
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
