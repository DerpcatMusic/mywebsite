"use client";

import { useEffect, useState } from "react";

interface TourDate {
  id: string;
  date: string;
  venue: string;
  city: string;
  state: string;
  ticketLink: string;
  soldOut?: boolean;
}

export default function AboutToursSection() {
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTourDates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/tour-dates");
        if (!response.ok) {
          throw new Error("Failed to fetch tour dates");
        }
        const data: TourDate[] = await response.json();
        setTourDates(data);
      } catch (err) {
        setError("Could not load tour dates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDates();
  }, []);

  return (
    <section id="tours" className="relative w-full py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl space-y-16">
          <div className="space-y-4">
            <span className="font-sans text-xs font-black uppercase tracking-[0.4em] text-white/30">
              The Journey
            </span>
            <h3 className="font-pixel text-4xl font-normal tracking-tight text-white md:text-6xl">
              Upcoming Appearances
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="flex animate-pulse space-x-4">
                <div className="h-10 w-10 rounded-full bg-white/5"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 rounded bg-white/5"></div>
                  <div className="h-2 w-3/4 rounded bg-white/5"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tourDates.length > 0 ? (
                <div className="grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5">
                  {tourDates.map((tour, index) => (
                    <div
                      key={index}
                      className="group flex flex-col justify-between gap-6 bg-background/40 p-8 transition-all duration-500 hover:bg-white/[0.03] md:flex-row md:items-center"
                    >
                      <div className="flex items-center gap-8">
                        <div className="flex min-w-[60px] flex-col items-center">
                          <span className="font-pixel text-2xl text-white/90">
                            {tour.date.includes(" ")
                              ? tour.date.split(" ")[1]
                              : tour.date}
                          </span>
                          <span className="font-sans text-[10px] font-black uppercase tracking-widest text-white/30">
                            {tour.date.includes(" ")
                              ? tour.date.split(" ")[0]
                              : "DATE"}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-sans text-xl font-medium text-white transition-colors group-hover:text-primary">
                            {tour.venue}
                          </h4>
                          <p className="font-sans text-sm tracking-wider text-white/40">
                            {tour.city}, {tour.state}
                          </p>
                        </div>
                      </div>

                      <a
                        href={tour.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.3em] text-white/40 transition-all hover:gap-6 hover:text-white"
                      >
                        {tour.soldOut ? "SOLD OUT" : "DETAILS"}
                        <div className="h-px w-10 bg-white/20 transition-all group-hover:w-16 group-hover:bg-white" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 text-center backdrop-blur-3xl">
                  <p className="font-sans text-xl italic text-white/40">
                    New dates announced soon...
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-8 text-center">
            <a
              href="https://www.bandsintown.com/artist-subscribe/15584038-derpcat"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs font-semibold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
            >
              Track on Bandsintown
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
