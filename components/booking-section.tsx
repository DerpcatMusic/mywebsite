"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getCalApi } from "@calcom/embed-react";
import { useForm, ValidationError } from "@formspree/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

function BookingCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("pixel-card p-8", className)}>
      <div className="mb-6">
        <h3 className="neon-text mb-3 font-pixel text-2xl uppercase text-foreground">
          {title}
        </h3>
        {description && (
          <p className="font-terminal text-xl text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function BookingSection() {
  const [state, handleSubmit] = useForm("mblynnle");
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

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

      tl.from(leftCardRef.current, {
        x: -100,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      }).from(
        rightCardRef.current,
        {
          x: 100,
          autoAlpha: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.6"
      );
    },
    { scope: containerRef }
  );

  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    gsap.to(e.target, {
      scale: 1.02,
      borderColor: "hsl(var(--primary))",
      duration: 0.3,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    gsap.to(e.target, {
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    (async function () {
      const calLesson = await getCalApi({ namespace: "musicproductionlesson" });
      calLesson("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#a855f7" },
          dark: { "cal-brand": "#a855f7" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      const calConsultation = await getCalApi({
        namespace: "music-consultation",
      });
      calConsultation("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#a855f7" },
          dark: { "cal-brand": "#a855f7" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <section
      ref={containerRef}
      id="book"
      className="relative flex h-full items-center py-20"
    >
      <div className="bg-noise absolute inset-0 opacity-20" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <h2 className="mb-6 font-pixel text-3xl uppercase text-foreground md:text-5xl">
              Let's <span className="text-gradient">Work Together</span>
            </h2>
            <p className="mx-auto max-w-2xl font-terminal text-2xl text-muted-foreground">
              Ready to bring your music vision to life? Get in touch or book a
              session!
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Left Column: Get in Touch Form */}
            <div ref={leftCardRef}>
              <BookingCard
                title="Get in Touch"
                className="transform transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="space-y-6">
                  {state.succeeded ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-2 border-green-500 bg-green-500/10">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                      </div>
                      <h3 className="mb-4 font-pixel text-2xl uppercase text-foreground">
                        Message Sent!
                      </h3>
                      <p className="font-terminal text-xl text-muted-foreground">
                        Thanks for reaching out! I'll get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="mb-3 block font-pixel text-xs uppercase text-foreground"
                          >
                            Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                            className="h-12 rounded-none border-2 border-white/20 bg-background font-terminal text-lg text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                          <ValidationError
                            prefix="Name"
                            field="name"
                            errors={state.errors}
                            className="mt-2 font-terminal text-sm text-red-400"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="mb-3 block font-pixel text-xs uppercase text-foreground"
                          >
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="h-12 rounded-none border-2 border-white/20 bg-background font-terminal text-lg text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                          />
                          <ValidationError
                            prefix="Email"
                            field="email"
                            errors={state.errors}
                            className="mt-2 font-terminal text-sm text-red-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="mb-3 block font-pixel text-xs uppercase text-foreground"
                        >
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell me about your project..."
                          rows={8}
                          required
                          className="resize-none rounded-none border-2 border-white/20 bg-background font-terminal text-lg text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-0"
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                        />
                        <ValidationError
                          prefix="Message"
                          field="message"
                          errors={state.errors}
                          className="mt-2 font-terminal text-sm text-red-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={state.submitting}
                        className="pixel-btn w-full py-6 text-sm"
                      >
                        {state.submitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </div>
              </BookingCard>
            </div>

            {/* Right Column: Book Me with Cal.com */}
            <div ref={rightCardRef}>
              <BookingCard
                title="Book a Session"
                className="transform transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="space-y-6">
                  {/* Big Booking Buttons */}
                  <div className="space-y-4">
                    {/* Book a Lesson Button */}
                    <Button
                      data-cal-namespace="musicproductionlesson"
                      data-cal-link="derpcat/musicproductionlesson"
                      data-cal-config='{"layout":"month_view"}'
                      className="pixel-btn w-full py-6 text-base md:text-lg"
                    >
                      📚 Music Production Lesson
                    </Button>

                    {/* Book a Consultation Button */}
                    <Button
                      data-cal-namespace="music-consultation"
                      data-cal-link="derpcat/music-consultation"
                      data-cal-config='{"layout":"month_view"}'
                      className="pixel-btn w-full py-6 text-base md:text-lg"
                    >
                      🎵 Music Consultation
                    </Button>
                  </div>

                  {/* Vibrant  Fun Content Instead of Services */}
                  <div className="marching-ants relative overflow-hidden border-2 border-primary bg-primary/10 p-6">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
                    <div className="relative z-10 space-y-4 text-center">
                      <h4 className="neon-text animate-pulse font-pixel text-lg uppercase text-foreground">
                        ⚡ Ready to Level Up? ⚡
                      </h4>
                      <p className="font-terminal text-xl leading-relaxed text-foreground">
                        Whether you're just starting out or polishing your
                        craft, I'll help you create music that stands out!
                      </p>
                      <div className="flex justify-center gap-4 pt-2">
                        <div className="h-3 w-3 animate-pulse bg-primary"></div>
                        <div className="animation-delay-100 h-3 w-3 animate-pulse bg-primary"></div>
                        <div className="animation-delay-200 h-3 w-3 animate-pulse bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </BookingCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
