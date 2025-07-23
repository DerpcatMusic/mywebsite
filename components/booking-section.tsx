"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Mail, Music, CheckCircle } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

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
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/30 via-transparent to-primary/30"
            style={{
              background: `radial-gradient(600px circle at var(--x) var(--y), rgba(255, 70, 0, 0.15), transparent 40%)`,
            }}
          />
        </div>

        <div className="relative p-8 min-h-[400px]">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {mounted ? children : null}
        </div>
      </div>
    </motion.div>
  );
}

export default function BookingSection() {
  const [state, handleSubmit] = useForm("mblynnle");

  return (
    <section id="book" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Work <span className="text-primary">With Me</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional music production services and personalized
              instruction
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Music Production Lessons Column */}
            <BookingCard
              title="Music Production Lessons"
              description="One-on-one personalized music production instruction"
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <div className="space-y-6">
                {/* Cal.com Embed */}
                <div className="bg-background/80 rounded-2xl p-6 border border-primary/10 shadow-inner backdrop-blur-sm">
                  <iframe
                    src="https://cal.com/derpcat/musicproductionlesson?embed=true&hide_event_type_details=1&background_color=0b0b0b&text_color=e7e7e7&primary_color=ff4600"
                    width="100%"
                    height="350"
                    style={{ border: "none", borderRadius: "16px" }}
                    title="Cal.com scheduling for Derpcat"
                  />
                </div>

                {/* Book Button */}
                <div className="text-center">
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-10 py-4 text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 border border-primary/20 hover:scale-105"
                  >
                    <a
                      href="https://cal.com/derpcat/musicproductionlesson?overlayCalendar=true"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book on Cal.com
                    </a>
                  </Button>
                </div>

                {/* Lesson Details */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold text-sm">
                        Duration
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        60 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold text-sm">
                        Scheduling
                      </h4>
                      <p className="text-muted-foreground text-xs">Real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            </BookingCard>

            {/* Get in Touch Column */}
            <BookingCard
              title="Get in Touch"
              description="Professional music production services and collaborations"
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <div className="space-y-6">
                {state.succeeded ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Thanks for reaching out! I'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="prod-name"
                          className="block text-sm font-semibold text-foreground mb-3"
                        >
                          Name
                        </label>
                        <Input
                          id="prod-name"
                          name="name"
                          placeholder="Your name"
                          className="bg-background/80 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-12 shadow-inner transition-all duration-200"
                        />
                        <ValidationError
                          prefix="Name"
                          field="name"
                          errors={state.errors}
                          className="text-red-400 text-sm mt-2"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="prod-email"
                          className="block text-sm font-semibold text-foreground mb-3"
                        >
                          Email
                        </label>
                        <Input
                          id="prod-email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-background/80 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-12 shadow-inner transition-all duration-200"
                        />
                        <ValidationError
                          prefix="Email"
                          field="email"
                          errors={state.errors}
                          className="text-red-400 text-sm mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="prod-message"
                        className="block text-sm font-semibold text-foreground mb-3"
                      >
                        Project Details
                      </label>
                      <Textarea
                        id="prod-message"
                        name="message"
                        placeholder="Tell me about your project... What's your vision? Do you have vocals recorded? What services do you need?"
                        rows={6}
                        className="bg-background/80 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none rounded-xl shadow-inner transition-all duration-200"
                      />
                      <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        className="text-red-400 text-sm mt-2"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-4 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 border border-primary/20 hover:scale-105"
                    >
                      {state.submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}

                {/* Services Info */}
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl shadow-inner backdrop-blur-sm">
                  <h4 className="text-foreground font-semibold mb-4 flex items-center text-lg">
                    <Music className="w-5 h-5 mr-3 text-primary" />
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
                      <div key={index} className="flex items-center group">
                        <div className="w-3 h-3 bg-primary rounded-full mr-4 transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/50"></div>
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
