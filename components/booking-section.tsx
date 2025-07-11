// ARTIST-LANDING/app/components/booking-section.tsx

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Mail, Music, DollarSign } from "lucide-react"
// Removed `type ClassValue` as it's not used in this component directly.

export default function BookingSection() {
  return (
    <section id="book" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Work <span className="text-primary">With Me</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Wanna learn something new or get a professionally produced track?
              <br />I'm your guy.
            </p>
          </div>

          {/* This grid wrapper uses items-stretch to make the columns themselves equal height */}
          <div className="grid lg:grid-cols-2 gap-12 items-start"> {/* Changed items-stretch to items-start for precise top alignment */}
            {/* Music Production Lessons Column */}
            <div className="space-y-6 flex flex-col">
              {/* Music Production Lessons Header Block */}
              <div className="text-center"> {/* Removed mb-8 from here; space-y-6 on parent handles gap */}
                <div className="w-16 h-16 bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Music Production Lessons</h3>
                <p className="text-gray-300 mb-4">One-on-one personalized music production instruction</p>
                {/* This div is the specific element that makes the left header taller */}
                <div className="flex items-center justify-center space-x-2 text-blue-500 font-semibold text-lg">
                </div>
              </div>

              {/* Cal.com Embed Card - Now CONTAINS ALL LESSON-RELATED INFO */}
              <Card
                className="bg-gray-900/40 border-blue-500/20 flex-grow min-h-[600px]" // flex-grow to fill space, min-h for consistent height
                style={{ borderRadius: "0px" }}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Cal.com iframe embed */}
                  <iframe
                    src="https://cal.com/derpcat/musicproductionlesson?embed=true&hide_event_type_details=1&background_color=1a1a1a&text_color=ffffff&primary_color=0087ff"
                    width="100%"
                    height="400" // Fixed height for iframe
                    style={{ border: "none" }}
                    title="Cal.com scheduling for Derpcat"
                  />
                  <div className="text-center">
                    <Button
                      asChild
                      className="bg-blue-500 hover:bg-transparent hover:border-2 hover:border-blue-500 text-white font-medium px-6 py-3 transition-all duration-150"
                      style={{ borderRadius: "0px" }}
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

                  {/* MOVED: Lesson Info - Now inside the CardContent */}
                  <div className="space-y-4 pt-4 border-t border-blue-500/10 mt-4"> {/* Added padding/margin/border for separation */}
                    <div className="flex items-center space-x-4">
                      <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium">Duration</h4>
                        <p className="text-gray-300 text-sm">60 minutes per session</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium">Availability</h4>
                        <p className="text-gray-300 text-sm">Synced with Cal.com - Real-time availability</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Get in Touch Column */}
            <div className="space-y-6 flex flex-col">
              {/* Get in Touch Header Block */}
              <div className="text-center"> {/* Removed mb-8 from here; space-y-6 on parent handles gap */}
                <div className="w-16 h-16 bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Get in Touch</h3>
                <p className="text-gray-300">Professional music production services</p>
                {/* ADDED THIS SPACER DIV to match the height of the "$60 per hour" line on the left */}
                <div className="h-7"></div> {/* h-7 is 1.75rem, designed to match text-lg line height */}
              </div>

              <Card
                className="bg-gray-900/40 border-blue-500/20 flex-grow min-h-[600px]" // flex-grow to fill space, min-h for consistent height
                style={{ borderRadius: "0px" }}
              >
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="prod-name" className="block text-sm font-medium text-white mb-2">
                          Name
                        </label>
                        <Input
                          id="prod-name"
                          placeholder="Your name"
                          className="bg-[#0a0a0a] border-blue-500/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                          style={{ borderRadius: "0px" }}
                        />
                      </div>
                      <div>
                        <label htmlFor="prod-email" className="block text-sm font-medium text-white mb-2">
                          Email
                        </label>
                        <Input
                          id="prod-email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-[#0a0a0a] border-blue-500/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                          style={{ borderRadius: "0px" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="prod-message" className="block text-sm font-medium text-white mb-2">
                        Project Details
                      </label>
                      <Textarea
                        id="prod-message"
                        placeholder="Tell me about your track... What's your vision? Do you have vocals recorded? What services do you need?"
                        rows={6}
                        className="bg-[#0a0a0a] border-blue-500/20 text-white placeholder:text-gray-400 focus:border-blue-500 resize-none"
                        style={{ borderRadius: "0px" }}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-transparent hover:border-2 hover:border-blue-500 text-white font-medium py-3 transition-all duration-150 hover:shadow-lg hover:shadow-blue-500/25"
                      style={{ borderRadius: "0px" }}
                    >
                      Send Message
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20" style={{ borderRadius: "0px" }}>
                    <h4 className="text-white font-medium mb-2">What you're here for:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Composition & arrangement</li>
                      <li>• Mixing & mastering</li>
                      <li>• Vocal recording & editing</li>
                      <li>• Sound design & effects</li>
                      <li>• Ghost Production</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}