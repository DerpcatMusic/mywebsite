"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getCalApi } from "@calcom/embed-react";
import { useForm, ValidationError } from "@formspree/react";
import { Calendar, CheckCircle, Clock, Music } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";

function BookingCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className={cn("relative w-full rounded-[24px]", className)}
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": useMotionTemplate`${mouseX}px`,
          "--y": useMotionTemplate`${mouseY}px`,
        } as React.CSSProperties
      }
    >
      <div className="group relative w-full overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card/90 via-card/60 to-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/30 via-transparent to-primary/30"
            style={{
              background:
                "radial-gradient(600px circle at var(--x) var(--y), rgba(255, 70, 0, 0.15), transparent 40%)",
            }}
          />
        </div>

        <div className="relative min-h-[400px] p-8">
          <div className="mb-6">
            <h3 className="mb-3 text-2xl font-bold text-foreground">{title}</h3>
          </div>
          {mounted ? children : null}
        </div>
      </div>
    </motion.div>
  );
}

export default function BookingSection() {
  const [state, handleSubmit] = useForm("mblynnle");

  useEffect(() => {
    (async function () {
      const calLesson = await getCalApi({"namespace":"musicproductionlesson"});
      calLesson("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#ff4600"},"dark":{"cal-brand":"#ff4600"}},"hideEventTypeDetails":false,"layout":"month_view"});

      const calConsultation = await getCalApi({"namespace":"music-consoultation"});
      calConsultation("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#ff4600"},"dark":{"cal-brand":"#ff4600"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])

  return (
    <section id="book" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">
              Work <span className="text-primary">With Me</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Professional music production services and personalized
              instruction
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Talk To Me Column */}
            <BookingCard
              title="Talk To Me"
              description=""
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Book a Lesson Button */}
                  <div className="text-center">
                    <Button
                      asChild
                      className="w-full rounded-2xl border border-primary/20 bg-primary py-4 text-lg font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                    >
                      <button
                        data-cal-namespace="musicproductionlesson"
                        data-cal-link="derpcat/musicproductionlesson"
                        data-cal-config='{"layout":"month_view"}'
                      >
                        Book a Lesson
                      </button>
                    </Button>
                  </div>

                  {/* Book a Consultation Button */}
                  <div className="text-center">
                    <Button
                      asChild
                      className="w-full rounded-2xl border border-primary/20 bg-primary py-4 text-lg font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                    >
                      <button
                        data-cal-namespace="music-consoultation"
                        data-cal-link="derpcat/music-consoultation"
                        data-cal-config='{"layout":"month_view"}'
                      >
                        Book a Consultation
                      </button>
                    </Button>
                  </div>
                </div>

                {/* Description moved below buttons */}
                <div className="text-center">
                  <p className="text-muted-foreground">
                    One-on-one personalized music production instruction and consultations
                  </p>
                </div>

                {/* Lesson Details */}
                <div className="grid grid-cols-2 gap-4 border-t border-primary/20 pt-4">
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Duration
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        60 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Scheduling
                      </h4>
                      <p className="text-xs text-muted-foreground">Real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            </BookingCard>

            {/* Get in Touch Column */}
            <BookingCard
              title="Get in Touch"
              description=""
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <div className="space-y-6">
                {state.succeeded ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-green-500/20 bg-green-500/10">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="mb-4 text-3xl font-bold text-foreground">
                      Message Sent!
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Thanks for reaching out! I'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="prod-name"
                            className="mb-3 block text-sm font-semibold text-foreground"
                          >
                            Name
                          </label>
                          <Input
                            id="prod-name"
                            name="name"
                            placeholder="Your name"
                            className="h-12 rounded-xl border-primary/20 bg-background/80 text-foreground shadow-inner transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <ValidationError
                            prefix="Name"
                            field="name"
                            errors={state.errors}
                            className="mt-2 text-sm text-red-400"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="prod-email"
                            className="mb-3 block text-sm font-semibold text-foreground"
                          >
                            Email
                          </label>
                          <Input
                            id="prod-email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            className="h-12 rounded-xl border-primary/20 bg-background/80 text-foreground shadow-inner transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <ValidationError
                            prefix="Email"
                            field="email"
                            errors={state.errors}
                            className="mt-2 text-sm text-red-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="prod-message"
                          className="mb-3 block text-sm font-semibold text-foreground"
                        >
                          Project Details
                        </label>
                        <Textarea
                          id="prod-message"
                          name="message"
                          placeholder="Tell me about your project... What's your vision? Do you have vocals recorded? What services do you need?"
                          rows={6}
                          className="resize-none rounded-xl border-primary/20 bg-background/80 text-foreground shadow-inner transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <ValidationError
                          prefix="Message"
                          field="message"
                          errors={state.errors}
                          className="mt-2 text-sm text-red-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={state.submitting}
                        className="w-full rounded-xl border border-primary/20 bg-primary py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {state.submitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>

                    {/* Description moved below form */}
                    <div className="text-center border-t border-primary/20 pt-4">
                      <p className="text-muted-foreground">
                        Professional music production services and collaborations
                      </p>
                    </div>
                  </>
                )}

                {/* Services Info */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-inner backdrop-blur-sm">
                  <h4 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <Music className="mr-3 h-5 w-5 text-primary" />
                    Services Available
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-muted-foreground">
                    {[
                      "Composition & arrangement",
                      "Mixing & mastering",
                      "Vocal recording & editing",
                      "Sound design & effects",
                      "Ghost production",
                    ].map((service, index) => (
                      <div key={index} className="group flex items-center">
                        <div className="mr-4 h-3 w-3 rounded-full bg-primary transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/50"></div>
                        <span className="transition-colors duration-200 group-hover:text-foreground">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BookingCard>
          </div>
        </div>
      </div>
    </section>
  );
}
